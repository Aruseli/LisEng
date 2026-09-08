/**
 * Fetch-клиент к Hasura GraphQL с API, совместимым с hasyx (select/insert/update/delete/upsert).
 * Семантика распаковки ответов повторяет hasyx@0.2.0-alpha.70:
 * - select: возвращает data[queryName] (массив или объект для _by_pk); aggregate — весь data
 * - insert/update/delete: bulk → { affected_rows, returning }, single (_one/_by_pk) → объект
 * - upsert: нативный INSERT ... on_conflict
 */
import { Generator, type Generate, type GenerateOptions, type GenerateResult } from './generator'

export type HasuraClientOptions = {
  /** URL GraphQL-эндпоинта Hasura, например https://xxx.hasura.app/v1/graphql */
  url: string
  /** Админ-секрет (серверный режим) */
  adminSecret?: string
  /** JWT пользователя (клиентский режим); функция — чтобы брать актуальный токен */
  getToken?: () => string | null | Promise<string | null>
  /** Роль по умолчанию (x-hasura-role) */
  role?: string
}

export type QueryOptions = Omit<GenerateOptions, 'operation'> & { role?: string }

export class HasuraError extends Error {
  graphQLErrors: Array<{ message: string; extensions?: Record<string, unknown> }>
  constructor(errors: Array<{ message: string; extensions?: Record<string, unknown> }>) {
    super(errors.map((e) => e.message).join('; ') || 'GraphQL error')
    this.name = 'HasuraError'
    this.graphQLErrors = errors
  }
}

export class HasuraClient {
  readonly generate: Generate
  private readonly opts: HasuraClientOptions

  constructor(opts: HasuraClientOptions, schema: unknown) {
    this.opts = opts
    this.generate = Generator(schema)
  }

  /** Сырой GraphQL-запрос (строка + переменные) — для ручных запросов вне генератора */
  async request<T = any>(
    query: string,
    variables?: Record<string, unknown>,
    role?: string,
  ): Promise<T> {
    const headers: Record<string, string> = { 'content-type': 'application/json' }
    if (this.opts.adminSecret) {
      headers['x-hasura-admin-secret'] = this.opts.adminSecret
    } else if (this.opts.getToken) {
      const token = await this.opts.getToken()
      if (token) headers['authorization'] = `Bearer ${token}`
    }
    const effectiveRole = role ?? this.opts.role
    if (effectiveRole) headers['x-hasura-role'] = effectiveRole

    const res = await fetch(this.opts.url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    })
    if (!res.ok) {
      throw new HasuraError([{ message: `HTTP ${res.status}: ${await res.text()}` }])
    }
    const json = (await res.json()) as {
      data?: T
      errors?: Array<{ message: string; extensions?: Record<string, unknown> }>
    }
    if (json.errors?.length) throw new HasuraError(json.errors)
    return json.data as T
  }

  private async exec(
    operation: GenerateOptions['operation'],
    options: QueryOptions,
  ): Promise<{ data: Record<string, any>; generated: GenerateResult }> {
    const { role, ...genOptions } = options
    const generated = this.generate({ ...genOptions, operation })
    const data = await this.request<Record<string, any>>(
      generated.queryString,
      generated.variables,
      role,
    )
    return { data: data ?? {}, generated }
  }

  /** SELECT: возвращает распакованные данные (массив, либо объект для _by_pk) */
  async select<T = any>(options: QueryOptions): Promise<T> {
    const { data, generated } = await this.exec('query', options)
    if (options.aggregate) return data as T
    return (data?.[generated.queryName] ?? null) as T
  }

  /** INSERT: single (_one) → объект; bulk → { affected_rows, returning } */
  async insert<T = any>(options: QueryOptions): Promise<T> {
    const { data, generated } = await this.exec('insert', options)
    return this.unwrapMutation<T>(data, generated.queryName, '_one')
  }

  /** UPDATE: _by_pk → объект; bulk → { affected_rows, returning } */
  async update<T = any>(options: QueryOptions): Promise<T> {
    const { data, generated } = await this.exec('update', options)
    return this.unwrapMutation<T>(data, generated.queryName, '_by_pk')
  }

  /** DELETE: _by_pk → объект; bulk → { affected_rows, returning } */
  async delete<T = any>(options: QueryOptions): Promise<T> {
    const { data, generated } = await this.exec('delete', options)
    return this.unwrapMutation<T>(data, generated.queryName, '_by_pk')
  }

  /** UPSERT: нативный INSERT ... on_conflict (on_conflict обязателен) */
  async upsert<T = any>(options: QueryOptions): Promise<T> {
    if (!options.on_conflict) {
      throw new Error('upsert требует on_conflict: { constraint, update_columns }')
    }
    const { data, generated } = await this.exec('insert', options)
    return this.unwrapMutation<T>(data, generated.queryName, '_one')
  }

  private unwrapMutation<T>(
    rawData: Record<string, any>,
    queryName: string,
    singleSuffix: string,
  ): T {
    // Повторяет логику hasyx: bulk-детект по top-level ключам affected_rows/returning
    const isBulk =
      !queryName.endsWith(singleSuffix) &&
      ('affected_rows' in rawData || 'returning' in rawData)
    if (isBulk) return rawData as T
    return (rawData?.[queryName] ?? null) as T
  }
}
