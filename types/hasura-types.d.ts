export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  bigint: { input: number; output: number };
  bytea: { input: any; output: any };
  date: { input: any; output: any };
  jsonb: { input: any; output: any };
  numeric: { input: number; output: number };
  time: { input: any; output: any };
  timestamp: { input: any; output: any };
  timestamptz: { input: number; output: number };
  uuid: { input: string; output: string };
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  _gt?: InputMaybe<Scalars["Boolean"]["input"]>;
  _gte?: InputMaybe<Scalars["Boolean"]["input"]>;
  _in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lte?: InputMaybe<Scalars["Boolean"]["input"]>;
  _neq?: InputMaybe<Scalars["Boolean"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["Int"]["input"]>;
  _gt?: InputMaybe<Scalars["Int"]["input"]>;
  _gte?: InputMaybe<Scalars["Int"]["input"]>;
  _in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["Int"]["input"]>;
  _lte?: InputMaybe<Scalars["Int"]["input"]>;
  _neq?: InputMaybe<Scalars["Int"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["Int"]["input"]>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["String"]["input"]>;
  _gt?: InputMaybe<Scalars["String"]["input"]>;
  _gte?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars["String"]["input"]>;
  _in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars["String"]["input"]>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars["String"]["input"]>;
  _lt?: InputMaybe<Scalars["String"]["input"]>;
  _lte?: InputMaybe<Scalars["String"]["input"]>;
  _neq?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars["String"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "accounts" */
export type Accounts = {
  __typename?: "accounts";
  /** OAuth access token */
  access_token?: Maybe<Scalars["String"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** Password hash for credentials providers (email/phone) */
  credential_hash?: Maybe<Scalars["String"]["output"]>;
  /** Token expiration timestamp */
  expires_at?: Maybe<Scalars["bigint"]["output"]>;
  id: Scalars["uuid"]["output"];
  /** OAuth ID token */
  id_token?: Maybe<Scalars["String"]["output"]>;
  /** OAuth token */
  oauth_token?: Maybe<Scalars["String"]["output"]>;
  /** OAuth token secret */
  oauth_token_secret?: Maybe<Scalars["String"]["output"]>;
  /** OAuth provider */
  provider: Scalars["String"]["output"];
  /** Provider account ID */
  provider_account_id: Scalars["String"]["output"];
  /** Additional provider-specific data (e.g., Telegram username, photo_url) */
  provider_data?: Maybe<Scalars["jsonb"]["output"]>;
  /** OAuth refresh token */
  refresh_token?: Maybe<Scalars["String"]["output"]>;
  /** OAuth scope */
  scope?: Maybe<Scalars["String"]["output"]>;
  /** OAuth session state */
  session_state?: Maybe<Scalars["String"]["output"]>;
  /** Token type */
  token_type?: Maybe<Scalars["String"]["output"]>;
  /** Account type */
  type: Scalars["String"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user: Users;
  /** Reference to users table */
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "accounts" */
export type AccountsProvider_DataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "accounts" */
export type Accounts_Aggregate = {
  __typename?: "accounts_aggregate";
  aggregate?: Maybe<Accounts_Aggregate_Fields>;
  nodes: Array<Accounts>;
};

export type Accounts_Aggregate_Bool_Exp = {
  count?: InputMaybe<Accounts_Aggregate_Bool_Exp_Count>;
};

export type Accounts_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Accounts_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Accounts_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "accounts" */
export type Accounts_Aggregate_Fields = {
  __typename?: "accounts_aggregate_fields";
  avg?: Maybe<Accounts_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Accounts_Max_Fields>;
  min?: Maybe<Accounts_Min_Fields>;
  stddev?: Maybe<Accounts_Stddev_Fields>;
  stddev_pop?: Maybe<Accounts_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Accounts_Stddev_Samp_Fields>;
  sum?: Maybe<Accounts_Sum_Fields>;
  var_pop?: Maybe<Accounts_Var_Pop_Fields>;
  var_samp?: Maybe<Accounts_Var_Samp_Fields>;
  variance?: Maybe<Accounts_Variance_Fields>;
};

/** aggregate fields of "accounts" */
export type Accounts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Accounts_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "accounts" */
export type Accounts_Aggregate_Order_By = {
  avg?: InputMaybe<Accounts_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Accounts_Max_Order_By>;
  min?: InputMaybe<Accounts_Min_Order_By>;
  stddev?: InputMaybe<Accounts_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Accounts_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Accounts_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Accounts_Sum_Order_By>;
  var_pop?: InputMaybe<Accounts_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Accounts_Var_Samp_Order_By>;
  variance?: InputMaybe<Accounts_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Accounts_Append_Input = {
  /** Additional provider-specific data (e.g., Telegram username, photo_url) */
  provider_data?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "accounts" */
export type Accounts_Arr_Rel_Insert_Input = {
  data: Array<Accounts_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Accounts_On_Conflict>;
};

/** aggregate avg on columns */
export type Accounts_Avg_Fields = {
  __typename?: "accounts_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Token expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "accounts" */
export type Accounts_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "accounts". All fields are combined with a logical 'AND'. */
export type Accounts_Bool_Exp = {
  _and?: InputMaybe<Array<Accounts_Bool_Exp>>;
  _not?: InputMaybe<Accounts_Bool_Exp>;
  _or?: InputMaybe<Array<Accounts_Bool_Exp>>;
  access_token?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  credential_hash?: InputMaybe<String_Comparison_Exp>;
  expires_at?: InputMaybe<Bigint_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  id_token?: InputMaybe<String_Comparison_Exp>;
  oauth_token?: InputMaybe<String_Comparison_Exp>;
  oauth_token_secret?: InputMaybe<String_Comparison_Exp>;
  provider?: InputMaybe<String_Comparison_Exp>;
  provider_account_id?: InputMaybe<String_Comparison_Exp>;
  provider_data?: InputMaybe<Jsonb_Comparison_Exp>;
  refresh_token?: InputMaybe<String_Comparison_Exp>;
  scope?: InputMaybe<String_Comparison_Exp>;
  session_state?: InputMaybe<String_Comparison_Exp>;
  token_type?: InputMaybe<String_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "accounts" */
export enum Accounts_Constraint {
  /** unique or primary key constraint on columns "id" */
  AccountsPkey = "accounts_pkey",
  /** unique or primary key constraint on columns "provider", "provider_account_id" */
  AccountsProviderProviderAccountIdUnique = "accounts_provider_provider_account_id_unique",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Accounts_Delete_At_Path_Input = {
  /** Additional provider-specific data (e.g., Telegram username, photo_url) */
  provider_data?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Accounts_Delete_Elem_Input = {
  /** Additional provider-specific data (e.g., Telegram username, photo_url) */
  provider_data?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Accounts_Delete_Key_Input = {
  /** Additional provider-specific data (e.g., Telegram username, photo_url) */
  provider_data?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "accounts" */
export type Accounts_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "accounts" */
export type Accounts_Insert_Input = {
  /** OAuth access token */
  access_token?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Password hash for credentials providers (email/phone) */
  credential_hash?: InputMaybe<Scalars["String"]["input"]>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** OAuth ID token */
  id_token?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth token */
  oauth_token?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth token secret */
  oauth_token_secret?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth provider */
  provider?: InputMaybe<Scalars["String"]["input"]>;
  /** Provider account ID */
  provider_account_id?: InputMaybe<Scalars["String"]["input"]>;
  /** Additional provider-specific data (e.g., Telegram username, photo_url) */
  provider_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** OAuth refresh token */
  refresh_token?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth scope */
  scope?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth session state */
  session_state?: InputMaybe<Scalars["String"]["input"]>;
  /** Token type */
  token_type?: InputMaybe<Scalars["String"]["input"]>;
  /** Account type */
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** Reference to users table */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Accounts_Max_Fields = {
  __typename?: "accounts_max_fields";
  /** OAuth access token */
  access_token?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Password hash for credentials providers (email/phone) */
  credential_hash?: Maybe<Scalars["String"]["output"]>;
  /** Token expiration timestamp */
  expires_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** OAuth ID token */
  id_token?: Maybe<Scalars["String"]["output"]>;
  /** OAuth token */
  oauth_token?: Maybe<Scalars["String"]["output"]>;
  /** OAuth token secret */
  oauth_token_secret?: Maybe<Scalars["String"]["output"]>;
  /** OAuth provider */
  provider?: Maybe<Scalars["String"]["output"]>;
  /** Provider account ID */
  provider_account_id?: Maybe<Scalars["String"]["output"]>;
  /** OAuth refresh token */
  refresh_token?: Maybe<Scalars["String"]["output"]>;
  /** OAuth scope */
  scope?: Maybe<Scalars["String"]["output"]>;
  /** OAuth session state */
  session_state?: Maybe<Scalars["String"]["output"]>;
  /** Token type */
  token_type?: Maybe<Scalars["String"]["output"]>;
  /** Account type */
  type?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Reference to users table */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "accounts" */
export type Accounts_Max_Order_By = {
  /** OAuth access token */
  access_token?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Password hash for credentials providers (email/phone) */
  credential_hash?: InputMaybe<Order_By>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** OAuth ID token */
  id_token?: InputMaybe<Order_By>;
  /** OAuth token */
  oauth_token?: InputMaybe<Order_By>;
  /** OAuth token secret */
  oauth_token_secret?: InputMaybe<Order_By>;
  /** OAuth provider */
  provider?: InputMaybe<Order_By>;
  /** Provider account ID */
  provider_account_id?: InputMaybe<Order_By>;
  /** OAuth refresh token */
  refresh_token?: InputMaybe<Order_By>;
  /** OAuth scope */
  scope?: InputMaybe<Order_By>;
  /** OAuth session state */
  session_state?: InputMaybe<Order_By>;
  /** Token type */
  token_type?: InputMaybe<Order_By>;
  /** Account type */
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** Reference to users table */
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Accounts_Min_Fields = {
  __typename?: "accounts_min_fields";
  /** OAuth access token */
  access_token?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Password hash for credentials providers (email/phone) */
  credential_hash?: Maybe<Scalars["String"]["output"]>;
  /** Token expiration timestamp */
  expires_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** OAuth ID token */
  id_token?: Maybe<Scalars["String"]["output"]>;
  /** OAuth token */
  oauth_token?: Maybe<Scalars["String"]["output"]>;
  /** OAuth token secret */
  oauth_token_secret?: Maybe<Scalars["String"]["output"]>;
  /** OAuth provider */
  provider?: Maybe<Scalars["String"]["output"]>;
  /** Provider account ID */
  provider_account_id?: Maybe<Scalars["String"]["output"]>;
  /** OAuth refresh token */
  refresh_token?: Maybe<Scalars["String"]["output"]>;
  /** OAuth scope */
  scope?: Maybe<Scalars["String"]["output"]>;
  /** OAuth session state */
  session_state?: Maybe<Scalars["String"]["output"]>;
  /** Token type */
  token_type?: Maybe<Scalars["String"]["output"]>;
  /** Account type */
  type?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Reference to users table */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "accounts" */
export type Accounts_Min_Order_By = {
  /** OAuth access token */
  access_token?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Password hash for credentials providers (email/phone) */
  credential_hash?: InputMaybe<Order_By>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** OAuth ID token */
  id_token?: InputMaybe<Order_By>;
  /** OAuth token */
  oauth_token?: InputMaybe<Order_By>;
  /** OAuth token secret */
  oauth_token_secret?: InputMaybe<Order_By>;
  /** OAuth provider */
  provider?: InputMaybe<Order_By>;
  /** Provider account ID */
  provider_account_id?: InputMaybe<Order_By>;
  /** OAuth refresh token */
  refresh_token?: InputMaybe<Order_By>;
  /** OAuth scope */
  scope?: InputMaybe<Order_By>;
  /** OAuth session state */
  session_state?: InputMaybe<Order_By>;
  /** Token type */
  token_type?: InputMaybe<Order_By>;
  /** Account type */
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** Reference to users table */
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "accounts" */
export type Accounts_Mutation_Response = {
  __typename?: "accounts_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Accounts>;
};

/** on_conflict condition type for table "accounts" */
export type Accounts_On_Conflict = {
  constraint: Accounts_Constraint;
  update_columns?: Array<Accounts_Update_Column>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};

/** Ordering options when selecting data from "accounts". */
export type Accounts_Order_By = {
  access_token?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  credential_hash?: InputMaybe<Order_By>;
  expires_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  id_token?: InputMaybe<Order_By>;
  oauth_token?: InputMaybe<Order_By>;
  oauth_token_secret?: InputMaybe<Order_By>;
  provider?: InputMaybe<Order_By>;
  provider_account_id?: InputMaybe<Order_By>;
  provider_data?: InputMaybe<Order_By>;
  refresh_token?: InputMaybe<Order_By>;
  scope?: InputMaybe<Order_By>;
  session_state?: InputMaybe<Order_By>;
  token_type?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: accounts */
export type Accounts_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Accounts_Prepend_Input = {
  /** Additional provider-specific data (e.g., Telegram username, photo_url) */
  provider_data?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "accounts" */
export enum Accounts_Select_Column {
  /** column name */
  AccessToken = "access_token",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  CredentialHash = "credential_hash",
  /** column name */
  ExpiresAt = "expires_at",
  /** column name */
  Id = "id",
  /** column name */
  IdToken = "id_token",
  /** column name */
  OauthToken = "oauth_token",
  /** column name */
  OauthTokenSecret = "oauth_token_secret",
  /** column name */
  Provider = "provider",
  /** column name */
  ProviderAccountId = "provider_account_id",
  /** column name */
  ProviderData = "provider_data",
  /** column name */
  RefreshToken = "refresh_token",
  /** column name */
  Scope = "scope",
  /** column name */
  SessionState = "session_state",
  /** column name */
  TokenType = "token_type",
  /** column name */
  Type = "type",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "accounts" */
export type Accounts_Set_Input = {
  /** OAuth access token */
  access_token?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Password hash for credentials providers (email/phone) */
  credential_hash?: InputMaybe<Scalars["String"]["input"]>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** OAuth ID token */
  id_token?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth token */
  oauth_token?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth token secret */
  oauth_token_secret?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth provider */
  provider?: InputMaybe<Scalars["String"]["input"]>;
  /** Provider account ID */
  provider_account_id?: InputMaybe<Scalars["String"]["input"]>;
  /** Additional provider-specific data (e.g., Telegram username, photo_url) */
  provider_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** OAuth refresh token */
  refresh_token?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth scope */
  scope?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth session state */
  session_state?: InputMaybe<Scalars["String"]["input"]>;
  /** Token type */
  token_type?: InputMaybe<Scalars["String"]["input"]>;
  /** Account type */
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Reference to users table */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Accounts_Stddev_Fields = {
  __typename?: "accounts_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Token expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "accounts" */
export type Accounts_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Accounts_Stddev_Pop_Fields = {
  __typename?: "accounts_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Token expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "accounts" */
export type Accounts_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Accounts_Stddev_Samp_Fields = {
  __typename?: "accounts_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Token expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "accounts" */
export type Accounts_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "accounts" */
export type Accounts_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Accounts_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Accounts_Stream_Cursor_Value_Input = {
  /** OAuth access token */
  access_token?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Password hash for credentials providers (email/phone) */
  credential_hash?: InputMaybe<Scalars["String"]["input"]>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** OAuth ID token */
  id_token?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth token */
  oauth_token?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth token secret */
  oauth_token_secret?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth provider */
  provider?: InputMaybe<Scalars["String"]["input"]>;
  /** Provider account ID */
  provider_account_id?: InputMaybe<Scalars["String"]["input"]>;
  /** Additional provider-specific data (e.g., Telegram username, photo_url) */
  provider_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** OAuth refresh token */
  refresh_token?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth scope */
  scope?: InputMaybe<Scalars["String"]["input"]>;
  /** OAuth session state */
  session_state?: InputMaybe<Scalars["String"]["input"]>;
  /** Token type */
  token_type?: InputMaybe<Scalars["String"]["input"]>;
  /** Account type */
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Reference to users table */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Accounts_Sum_Fields = {
  __typename?: "accounts_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Token expiration timestamp */
  expires_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "accounts" */
export type Accounts_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "accounts" */
export enum Accounts_Update_Column {
  /** column name */
  AccessToken = "access_token",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  CredentialHash = "credential_hash",
  /** column name */
  ExpiresAt = "expires_at",
  /** column name */
  Id = "id",
  /** column name */
  IdToken = "id_token",
  /** column name */
  OauthToken = "oauth_token",
  /** column name */
  OauthTokenSecret = "oauth_token_secret",
  /** column name */
  Provider = "provider",
  /** column name */
  ProviderAccountId = "provider_account_id",
  /** column name */
  ProviderData = "provider_data",
  /** column name */
  RefreshToken = "refresh_token",
  /** column name */
  Scope = "scope",
  /** column name */
  SessionState = "session_state",
  /** column name */
  TokenType = "token_type",
  /** column name */
  Type = "type",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Accounts_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Accounts_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Accounts_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Accounts_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Accounts_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Accounts_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Accounts_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Accounts_Set_Input>;
  /** filter the rows which have to be updated */
  where: Accounts_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Accounts_Var_Pop_Fields = {
  __typename?: "accounts_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Token expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "accounts" */
export type Accounts_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Accounts_Var_Samp_Fields = {
  __typename?: "accounts_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Token expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "accounts" */
export type Accounts_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Accounts_Variance_Fields = {
  __typename?: "accounts_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Token expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "accounts" */
export type Accounts_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Token expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "achievements" */
export type Achievements = {
  __typename?: "achievements";
  description?: Maybe<Scalars["String"]["output"]>;
  icon?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["uuid"]["output"];
  title: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
  unlocked_at?: Maybe<Scalars["timestamp"]["output"]>;
  /** An object relationship */
  user?: Maybe<Users>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregated selection of "achievements" */
export type Achievements_Aggregate = {
  __typename?: "achievements_aggregate";
  aggregate?: Maybe<Achievements_Aggregate_Fields>;
  nodes: Array<Achievements>;
};

export type Achievements_Aggregate_Bool_Exp = {
  count?: InputMaybe<Achievements_Aggregate_Bool_Exp_Count>;
};

export type Achievements_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Achievements_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Achievements_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "achievements" */
export type Achievements_Aggregate_Fields = {
  __typename?: "achievements_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Achievements_Max_Fields>;
  min?: Maybe<Achievements_Min_Fields>;
};

/** aggregate fields of "achievements" */
export type Achievements_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Achievements_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "achievements" */
export type Achievements_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Achievements_Max_Order_By>;
  min?: InputMaybe<Achievements_Min_Order_By>;
};

/** input type for inserting array relation for remote table "achievements" */
export type Achievements_Arr_Rel_Insert_Input = {
  data: Array<Achievements_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Achievements_On_Conflict>;
};

/** Boolean expression to filter rows from the table "achievements". All fields are combined with a logical 'AND'. */
export type Achievements_Bool_Exp = {
  _and?: InputMaybe<Array<Achievements_Bool_Exp>>;
  _not?: InputMaybe<Achievements_Bool_Exp>;
  _or?: InputMaybe<Array<Achievements_Bool_Exp>>;
  description?: InputMaybe<String_Comparison_Exp>;
  icon?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  unlocked_at?: InputMaybe<Timestamp_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "achievements" */
export enum Achievements_Constraint {
  /** unique or primary key constraint on columns "id" */
  AchievementsPkey = "achievements_pkey",
}

/** input type for inserting data into table "achievements" */
export type Achievements_Insert_Input = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  icon?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
  unlocked_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Achievements_Max_Fields = {
  __typename?: "achievements_max_fields";
  description?: Maybe<Scalars["String"]["output"]>;
  icon?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  type?: Maybe<Scalars["String"]["output"]>;
  unlocked_at?: Maybe<Scalars["timestamp"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "achievements" */
export type Achievements_Max_Order_By = {
  description?: InputMaybe<Order_By>;
  icon?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  unlocked_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Achievements_Min_Fields = {
  __typename?: "achievements_min_fields";
  description?: Maybe<Scalars["String"]["output"]>;
  icon?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  type?: Maybe<Scalars["String"]["output"]>;
  unlocked_at?: Maybe<Scalars["timestamp"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "achievements" */
export type Achievements_Min_Order_By = {
  description?: InputMaybe<Order_By>;
  icon?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  unlocked_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "achievements" */
export type Achievements_Mutation_Response = {
  __typename?: "achievements_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Achievements>;
};

/** on_conflict condition type for table "achievements" */
export type Achievements_On_Conflict = {
  constraint: Achievements_Constraint;
  update_columns?: Array<Achievements_Update_Column>;
  where?: InputMaybe<Achievements_Bool_Exp>;
};

/** Ordering options when selecting data from "achievements". */
export type Achievements_Order_By = {
  description?: InputMaybe<Order_By>;
  icon?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  unlocked_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: achievements */
export type Achievements_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "achievements" */
export enum Achievements_Select_Column {
  /** column name */
  Description = "description",
  /** column name */
  Icon = "icon",
  /** column name */
  Id = "id",
  /** column name */
  Title = "title",
  /** column name */
  Type = "type",
  /** column name */
  UnlockedAt = "unlocked_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "achievements" */
export type Achievements_Set_Input = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  icon?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
  unlocked_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** Streaming cursor of the table "achievements" */
export type Achievements_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Achievements_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Achievements_Stream_Cursor_Value_Input = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  icon?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
  unlocked_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "achievements" */
export enum Achievements_Update_Column {
  /** column name */
  Description = "description",
  /** column name */
  Icon = "icon",
  /** column name */
  Id = "id",
  /** column name */
  Title = "title",
  /** column name */
  Type = "type",
  /** column name */
  UnlockedAt = "unlocked_at",
  /** column name */
  UserId = "user_id",
}

export type Achievements_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Achievements_Set_Input>;
  /** filter the rows which have to be updated */
  where: Achievements_Bool_Exp;
};

/** columns and relationships of "ai_sessions" */
export type Ai_Sessions = {
  __typename?: "ai_sessions";
  conversation?: Maybe<Scalars["jsonb"]["output"]>;
  duration_minutes?: Maybe<Scalars["Int"]["output"]>;
  ended_at?: Maybe<Scalars["timestamp"]["output"]>;
  feedback?: Maybe<Scalars["jsonb"]["output"]>;
  id: Scalars["uuid"]["output"];
  session_date?: Maybe<Scalars["date"]["output"]>;
  started_at?: Maybe<Scalars["timestamp"]["output"]>;
  topic?: Maybe<Scalars["String"]["output"]>;
  type: Scalars["String"]["output"];
  /** An object relationship */
  user?: Maybe<Users>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** columns and relationships of "ai_sessions" */
export type Ai_SessionsConversationArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "ai_sessions" */
export type Ai_SessionsFeedbackArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "ai_sessions" */
export type Ai_Sessions_Aggregate = {
  __typename?: "ai_sessions_aggregate";
  aggregate?: Maybe<Ai_Sessions_Aggregate_Fields>;
  nodes: Array<Ai_Sessions>;
};

export type Ai_Sessions_Aggregate_Bool_Exp = {
  count?: InputMaybe<Ai_Sessions_Aggregate_Bool_Exp_Count>;
};

export type Ai_Sessions_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Ai_Sessions_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Ai_Sessions_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "ai_sessions" */
export type Ai_Sessions_Aggregate_Fields = {
  __typename?: "ai_sessions_aggregate_fields";
  avg?: Maybe<Ai_Sessions_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Ai_Sessions_Max_Fields>;
  min?: Maybe<Ai_Sessions_Min_Fields>;
  stddev?: Maybe<Ai_Sessions_Stddev_Fields>;
  stddev_pop?: Maybe<Ai_Sessions_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Ai_Sessions_Stddev_Samp_Fields>;
  sum?: Maybe<Ai_Sessions_Sum_Fields>;
  var_pop?: Maybe<Ai_Sessions_Var_Pop_Fields>;
  var_samp?: Maybe<Ai_Sessions_Var_Samp_Fields>;
  variance?: Maybe<Ai_Sessions_Variance_Fields>;
};

/** aggregate fields of "ai_sessions" */
export type Ai_Sessions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Ai_Sessions_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "ai_sessions" */
export type Ai_Sessions_Aggregate_Order_By = {
  avg?: InputMaybe<Ai_Sessions_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Ai_Sessions_Max_Order_By>;
  min?: InputMaybe<Ai_Sessions_Min_Order_By>;
  stddev?: InputMaybe<Ai_Sessions_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Ai_Sessions_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Ai_Sessions_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Ai_Sessions_Sum_Order_By>;
  var_pop?: InputMaybe<Ai_Sessions_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Ai_Sessions_Var_Samp_Order_By>;
  variance?: InputMaybe<Ai_Sessions_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Ai_Sessions_Append_Input = {
  conversation?: InputMaybe<Scalars["jsonb"]["input"]>;
  feedback?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "ai_sessions" */
export type Ai_Sessions_Arr_Rel_Insert_Input = {
  data: Array<Ai_Sessions_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Ai_Sessions_On_Conflict>;
};

/** aggregate avg on columns */
export type Ai_Sessions_Avg_Fields = {
  __typename?: "ai_sessions_avg_fields";
  duration_minutes?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "ai_sessions" */
export type Ai_Sessions_Avg_Order_By = {
  duration_minutes?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "ai_sessions". All fields are combined with a logical 'AND'. */
export type Ai_Sessions_Bool_Exp = {
  _and?: InputMaybe<Array<Ai_Sessions_Bool_Exp>>;
  _not?: InputMaybe<Ai_Sessions_Bool_Exp>;
  _or?: InputMaybe<Array<Ai_Sessions_Bool_Exp>>;
  conversation?: InputMaybe<Jsonb_Comparison_Exp>;
  duration_minutes?: InputMaybe<Int_Comparison_Exp>;
  ended_at?: InputMaybe<Timestamp_Comparison_Exp>;
  feedback?: InputMaybe<Jsonb_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  session_date?: InputMaybe<Date_Comparison_Exp>;
  started_at?: InputMaybe<Timestamp_Comparison_Exp>;
  topic?: InputMaybe<String_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "ai_sessions" */
export enum Ai_Sessions_Constraint {
  /** unique or primary key constraint on columns "id" */
  AiSessionsPkey = "ai_sessions_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Ai_Sessions_Delete_At_Path_Input = {
  conversation?: InputMaybe<Array<Scalars["String"]["input"]>>;
  feedback?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Ai_Sessions_Delete_Elem_Input = {
  conversation?: InputMaybe<Scalars["Int"]["input"]>;
  feedback?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Ai_Sessions_Delete_Key_Input = {
  conversation?: InputMaybe<Scalars["String"]["input"]>;
  feedback?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "ai_sessions" */
export type Ai_Sessions_Inc_Input = {
  duration_minutes?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "ai_sessions" */
export type Ai_Sessions_Insert_Input = {
  conversation?: InputMaybe<Scalars["jsonb"]["input"]>;
  duration_minutes?: InputMaybe<Scalars["Int"]["input"]>;
  ended_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  feedback?: InputMaybe<Scalars["jsonb"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  session_date?: InputMaybe<Scalars["date"]["input"]>;
  started_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  topic?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Ai_Sessions_Max_Fields = {
  __typename?: "ai_sessions_max_fields";
  duration_minutes?: Maybe<Scalars["Int"]["output"]>;
  ended_at?: Maybe<Scalars["timestamp"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  session_date?: Maybe<Scalars["date"]["output"]>;
  started_at?: Maybe<Scalars["timestamp"]["output"]>;
  topic?: Maybe<Scalars["String"]["output"]>;
  type?: Maybe<Scalars["String"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "ai_sessions" */
export type Ai_Sessions_Max_Order_By = {
  duration_minutes?: InputMaybe<Order_By>;
  ended_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  session_date?: InputMaybe<Order_By>;
  started_at?: InputMaybe<Order_By>;
  topic?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Ai_Sessions_Min_Fields = {
  __typename?: "ai_sessions_min_fields";
  duration_minutes?: Maybe<Scalars["Int"]["output"]>;
  ended_at?: Maybe<Scalars["timestamp"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  session_date?: Maybe<Scalars["date"]["output"]>;
  started_at?: Maybe<Scalars["timestamp"]["output"]>;
  topic?: Maybe<Scalars["String"]["output"]>;
  type?: Maybe<Scalars["String"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "ai_sessions" */
export type Ai_Sessions_Min_Order_By = {
  duration_minutes?: InputMaybe<Order_By>;
  ended_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  session_date?: InputMaybe<Order_By>;
  started_at?: InputMaybe<Order_By>;
  topic?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "ai_sessions" */
export type Ai_Sessions_Mutation_Response = {
  __typename?: "ai_sessions_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Ai_Sessions>;
};

/** on_conflict condition type for table "ai_sessions" */
export type Ai_Sessions_On_Conflict = {
  constraint: Ai_Sessions_Constraint;
  update_columns?: Array<Ai_Sessions_Update_Column>;
  where?: InputMaybe<Ai_Sessions_Bool_Exp>;
};

/** Ordering options when selecting data from "ai_sessions". */
export type Ai_Sessions_Order_By = {
  conversation?: InputMaybe<Order_By>;
  duration_minutes?: InputMaybe<Order_By>;
  ended_at?: InputMaybe<Order_By>;
  feedback?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  session_date?: InputMaybe<Order_By>;
  started_at?: InputMaybe<Order_By>;
  topic?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: ai_sessions */
export type Ai_Sessions_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Ai_Sessions_Prepend_Input = {
  conversation?: InputMaybe<Scalars["jsonb"]["input"]>;
  feedback?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "ai_sessions" */
export enum Ai_Sessions_Select_Column {
  /** column name */
  Conversation = "conversation",
  /** column name */
  DurationMinutes = "duration_minutes",
  /** column name */
  EndedAt = "ended_at",
  /** column name */
  Feedback = "feedback",
  /** column name */
  Id = "id",
  /** column name */
  SessionDate = "session_date",
  /** column name */
  StartedAt = "started_at",
  /** column name */
  Topic = "topic",
  /** column name */
  Type = "type",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "ai_sessions" */
export type Ai_Sessions_Set_Input = {
  conversation?: InputMaybe<Scalars["jsonb"]["input"]>;
  duration_minutes?: InputMaybe<Scalars["Int"]["input"]>;
  ended_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  feedback?: InputMaybe<Scalars["jsonb"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  session_date?: InputMaybe<Scalars["date"]["input"]>;
  started_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  topic?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Ai_Sessions_Stddev_Fields = {
  __typename?: "ai_sessions_stddev_fields";
  duration_minutes?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "ai_sessions" */
export type Ai_Sessions_Stddev_Order_By = {
  duration_minutes?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Ai_Sessions_Stddev_Pop_Fields = {
  __typename?: "ai_sessions_stddev_pop_fields";
  duration_minutes?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "ai_sessions" */
export type Ai_Sessions_Stddev_Pop_Order_By = {
  duration_minutes?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Ai_Sessions_Stddev_Samp_Fields = {
  __typename?: "ai_sessions_stddev_samp_fields";
  duration_minutes?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "ai_sessions" */
export type Ai_Sessions_Stddev_Samp_Order_By = {
  duration_minutes?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "ai_sessions" */
export type Ai_Sessions_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Ai_Sessions_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Ai_Sessions_Stream_Cursor_Value_Input = {
  conversation?: InputMaybe<Scalars["jsonb"]["input"]>;
  duration_minutes?: InputMaybe<Scalars["Int"]["input"]>;
  ended_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  feedback?: InputMaybe<Scalars["jsonb"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  session_date?: InputMaybe<Scalars["date"]["input"]>;
  started_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  topic?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Ai_Sessions_Sum_Fields = {
  __typename?: "ai_sessions_sum_fields";
  duration_minutes?: Maybe<Scalars["Int"]["output"]>;
};

/** order by sum() on columns of table "ai_sessions" */
export type Ai_Sessions_Sum_Order_By = {
  duration_minutes?: InputMaybe<Order_By>;
};

/** update columns of table "ai_sessions" */
export enum Ai_Sessions_Update_Column {
  /** column name */
  Conversation = "conversation",
  /** column name */
  DurationMinutes = "duration_minutes",
  /** column name */
  EndedAt = "ended_at",
  /** column name */
  Feedback = "feedback",
  /** column name */
  Id = "id",
  /** column name */
  SessionDate = "session_date",
  /** column name */
  StartedAt = "started_at",
  /** column name */
  Topic = "topic",
  /** column name */
  Type = "type",
  /** column name */
  UserId = "user_id",
}

export type Ai_Sessions_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Ai_Sessions_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Ai_Sessions_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Ai_Sessions_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Ai_Sessions_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Ai_Sessions_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Ai_Sessions_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Ai_Sessions_Set_Input>;
  /** filter the rows which have to be updated */
  where: Ai_Sessions_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Ai_Sessions_Var_Pop_Fields = {
  __typename?: "ai_sessions_var_pop_fields";
  duration_minutes?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "ai_sessions" */
export type Ai_Sessions_Var_Pop_Order_By = {
  duration_minutes?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Ai_Sessions_Var_Samp_Fields = {
  __typename?: "ai_sessions_var_samp_fields";
  duration_minutes?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "ai_sessions" */
export type Ai_Sessions_Var_Samp_Order_By = {
  duration_minutes?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Ai_Sessions_Variance_Fields = {
  __typename?: "ai_sessions_variance_fields";
  duration_minutes?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "ai_sessions" */
export type Ai_Sessions_Variance_Order_By = {
  duration_minutes?: InputMaybe<Order_By>;
};

/** columns and relationships of "auth_jwt" */
export type Auth_Jwt = {
  __typename?: "auth_jwt";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  created_ms: Scalars["bigint"]["output"];
  id: Scalars["uuid"]["output"];
  jwt?: Maybe<Scalars["String"]["output"]>;
  redirect?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  updated_ms: Scalars["bigint"]["output"];
};

/** aggregated selection of "auth_jwt" */
export type Auth_Jwt_Aggregate = {
  __typename?: "auth_jwt_aggregate";
  aggregate?: Maybe<Auth_Jwt_Aggregate_Fields>;
  nodes: Array<Auth_Jwt>;
};

/** aggregate fields of "auth_jwt" */
export type Auth_Jwt_Aggregate_Fields = {
  __typename?: "auth_jwt_aggregate_fields";
  avg?: Maybe<Auth_Jwt_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Auth_Jwt_Max_Fields>;
  min?: Maybe<Auth_Jwt_Min_Fields>;
  stddev?: Maybe<Auth_Jwt_Stddev_Fields>;
  stddev_pop?: Maybe<Auth_Jwt_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Auth_Jwt_Stddev_Samp_Fields>;
  sum?: Maybe<Auth_Jwt_Sum_Fields>;
  var_pop?: Maybe<Auth_Jwt_Var_Pop_Fields>;
  var_samp?: Maybe<Auth_Jwt_Var_Samp_Fields>;
  variance?: Maybe<Auth_Jwt_Variance_Fields>;
};

/** aggregate fields of "auth_jwt" */
export type Auth_Jwt_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Auth_Jwt_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Auth_Jwt_Avg_Fields = {
  __typename?: "auth_jwt_avg_fields";
  created_ms?: Maybe<Scalars["Float"]["output"]>;
  updated_ms?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "auth_jwt". All fields are combined with a logical 'AND'. */
export type Auth_Jwt_Bool_Exp = {
  _and?: InputMaybe<Array<Auth_Jwt_Bool_Exp>>;
  _not?: InputMaybe<Auth_Jwt_Bool_Exp>;
  _or?: InputMaybe<Array<Auth_Jwt_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_ms?: InputMaybe<Bigint_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  jwt?: InputMaybe<String_Comparison_Exp>;
  redirect?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_ms?: InputMaybe<Bigint_Comparison_Exp>;
};

/** unique or primary key constraints on table "auth_jwt" */
export enum Auth_Jwt_Constraint {
  /** unique or primary key constraint on columns "id" */
  AuthJwtPkey = "auth_jwt_pkey",
}

/** input type for incrementing numeric columns in table "auth_jwt" */
export type Auth_Jwt_Inc_Input = {
  created_ms?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_ms?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "auth_jwt" */
export type Auth_Jwt_Insert_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_ms?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  jwt?: InputMaybe<Scalars["String"]["input"]>;
  redirect?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  updated_ms?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate max on columns */
export type Auth_Jwt_Max_Fields = {
  __typename?: "auth_jwt_max_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  created_ms?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  jwt?: Maybe<Scalars["String"]["output"]>;
  redirect?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  updated_ms?: Maybe<Scalars["bigint"]["output"]>;
};

/** aggregate min on columns */
export type Auth_Jwt_Min_Fields = {
  __typename?: "auth_jwt_min_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  created_ms?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  jwt?: Maybe<Scalars["String"]["output"]>;
  redirect?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  updated_ms?: Maybe<Scalars["bigint"]["output"]>;
};

/** response of any mutation on the table "auth_jwt" */
export type Auth_Jwt_Mutation_Response = {
  __typename?: "auth_jwt_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Auth_Jwt>;
};

/** on_conflict condition type for table "auth_jwt" */
export type Auth_Jwt_On_Conflict = {
  constraint: Auth_Jwt_Constraint;
  update_columns?: Array<Auth_Jwt_Update_Column>;
  where?: InputMaybe<Auth_Jwt_Bool_Exp>;
};

/** Ordering options when selecting data from "auth_jwt". */
export type Auth_Jwt_Order_By = {
  created_at?: InputMaybe<Order_By>;
  created_ms?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  jwt?: InputMaybe<Order_By>;
  redirect?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_ms?: InputMaybe<Order_By>;
};

/** primary key columns input for table: auth_jwt */
export type Auth_Jwt_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "auth_jwt" */
export enum Auth_Jwt_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  CreatedMs = "created_ms",
  /** column name */
  Id = "id",
  /** column name */
  Jwt = "jwt",
  /** column name */
  Redirect = "redirect",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UpdatedMs = "updated_ms",
}

/** input type for updating data in table "auth_jwt" */
export type Auth_Jwt_Set_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_ms?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  jwt?: InputMaybe<Scalars["String"]["input"]>;
  redirect?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  updated_ms?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate stddev on columns */
export type Auth_Jwt_Stddev_Fields = {
  __typename?: "auth_jwt_stddev_fields";
  created_ms?: Maybe<Scalars["Float"]["output"]>;
  updated_ms?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Auth_Jwt_Stddev_Pop_Fields = {
  __typename?: "auth_jwt_stddev_pop_fields";
  created_ms?: Maybe<Scalars["Float"]["output"]>;
  updated_ms?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Auth_Jwt_Stddev_Samp_Fields = {
  __typename?: "auth_jwt_stddev_samp_fields";
  created_ms?: Maybe<Scalars["Float"]["output"]>;
  updated_ms?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "auth_jwt" */
export type Auth_Jwt_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Auth_Jwt_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Auth_Jwt_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_ms?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  jwt?: InputMaybe<Scalars["String"]["input"]>;
  redirect?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  updated_ms?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate sum on columns */
export type Auth_Jwt_Sum_Fields = {
  __typename?: "auth_jwt_sum_fields";
  created_ms?: Maybe<Scalars["bigint"]["output"]>;
  updated_ms?: Maybe<Scalars["bigint"]["output"]>;
};

/** update columns of table "auth_jwt" */
export enum Auth_Jwt_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  CreatedMs = "created_ms",
  /** column name */
  Id = "id",
  /** column name */
  Jwt = "jwt",
  /** column name */
  Redirect = "redirect",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UpdatedMs = "updated_ms",
}

export type Auth_Jwt_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Auth_Jwt_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Auth_Jwt_Set_Input>;
  /** filter the rows which have to be updated */
  where: Auth_Jwt_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Auth_Jwt_Var_Pop_Fields = {
  __typename?: "auth_jwt_var_pop_fields";
  created_ms?: Maybe<Scalars["Float"]["output"]>;
  updated_ms?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Auth_Jwt_Var_Samp_Fields = {
  __typename?: "auth_jwt_var_samp_fields";
  created_ms?: Maybe<Scalars["Float"]["output"]>;
  updated_ms?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Auth_Jwt_Variance_Fields = {
  __typename?: "auth_jwt_variance_fields";
  created_ms?: Maybe<Scalars["Float"]["output"]>;
  updated_ms?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["bigint"]["input"]>;
  _gt?: InputMaybe<Scalars["bigint"]["input"]>;
  _gte?: InputMaybe<Scalars["bigint"]["input"]>;
  _in?: InputMaybe<Array<Scalars["bigint"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["bigint"]["input"]>;
  _lte?: InputMaybe<Scalars["bigint"]["input"]>;
  _neq?: InputMaybe<Scalars["bigint"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["bigint"]["input"]>>;
};

/** columns and relationships of "storage.buckets" */
export type Buckets = {
  __typename?: "buckets";
  cacheControl?: Maybe<Scalars["String"]["output"]>;
  createdAt: Scalars["timestamptz"]["output"];
  downloadExpiration: Scalars["Int"]["output"];
  /** An array relationship */
  files: Array<Files>;
  /** An aggregate relationship */
  files_aggregate: Files_Aggregate;
  id: Scalars["String"]["output"];
  maxUploadFileSize: Scalars["Int"]["output"];
  minUploadFileSize: Scalars["Int"]["output"];
  presignedUrlsEnabled: Scalars["Boolean"]["output"];
  updatedAt: Scalars["timestamptz"]["output"];
};

/** columns and relationships of "storage.buckets" */
export type BucketsFilesArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};

/** columns and relationships of "storage.buckets" */
export type BucketsFiles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};

/** aggregated selection of "storage.buckets" */
export type Buckets_Aggregate = {
  __typename?: "buckets_aggregate";
  aggregate?: Maybe<Buckets_Aggregate_Fields>;
  nodes: Array<Buckets>;
};

/** aggregate fields of "storage.buckets" */
export type Buckets_Aggregate_Fields = {
  __typename?: "buckets_aggregate_fields";
  avg?: Maybe<Buckets_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Buckets_Max_Fields>;
  min?: Maybe<Buckets_Min_Fields>;
  stddev?: Maybe<Buckets_Stddev_Fields>;
  stddev_pop?: Maybe<Buckets_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Buckets_Stddev_Samp_Fields>;
  sum?: Maybe<Buckets_Sum_Fields>;
  var_pop?: Maybe<Buckets_Var_Pop_Fields>;
  var_samp?: Maybe<Buckets_Var_Samp_Fields>;
  variance?: Maybe<Buckets_Variance_Fields>;
};

/** aggregate fields of "storage.buckets" */
export type Buckets_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Buckets_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Buckets_Avg_Fields = {
  __typename?: "buckets_avg_fields";
  downloadExpiration?: Maybe<Scalars["Float"]["output"]>;
  maxUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
  minUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "storage.buckets". All fields are combined with a logical 'AND'. */
export type Buckets_Bool_Exp = {
  _and?: InputMaybe<Array<Buckets_Bool_Exp>>;
  _not?: InputMaybe<Buckets_Bool_Exp>;
  _or?: InputMaybe<Array<Buckets_Bool_Exp>>;
  cacheControl?: InputMaybe<String_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  downloadExpiration?: InputMaybe<Int_Comparison_Exp>;
  files?: InputMaybe<Files_Bool_Exp>;
  files_aggregate?: InputMaybe<Files_Aggregate_Bool_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  maxUploadFileSize?: InputMaybe<Int_Comparison_Exp>;
  minUploadFileSize?: InputMaybe<Int_Comparison_Exp>;
  presignedUrlsEnabled?: InputMaybe<Boolean_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "storage.buckets" */
export enum Buckets_Constraint {
  /** unique or primary key constraint on columns "id" */
  BucketsPkey = "buckets_pkey",
}

/** input type for incrementing numeric columns in table "storage.buckets" */
export type Buckets_Inc_Input = {
  downloadExpiration?: InputMaybe<Scalars["Int"]["input"]>;
  maxUploadFileSize?: InputMaybe<Scalars["Int"]["input"]>;
  minUploadFileSize?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "storage.buckets" */
export type Buckets_Insert_Input = {
  cacheControl?: InputMaybe<Scalars["String"]["input"]>;
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  downloadExpiration?: InputMaybe<Scalars["Int"]["input"]>;
  files?: InputMaybe<Files_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  maxUploadFileSize?: InputMaybe<Scalars["Int"]["input"]>;
  minUploadFileSize?: InputMaybe<Scalars["Int"]["input"]>;
  presignedUrlsEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type Buckets_Max_Fields = {
  __typename?: "buckets_max_fields";
  cacheControl?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["timestamptz"]["output"]>;
  downloadExpiration?: Maybe<Scalars["Int"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  maxUploadFileSize?: Maybe<Scalars["Int"]["output"]>;
  minUploadFileSize?: Maybe<Scalars["Int"]["output"]>;
  updatedAt?: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregate min on columns */
export type Buckets_Min_Fields = {
  __typename?: "buckets_min_fields";
  cacheControl?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["timestamptz"]["output"]>;
  downloadExpiration?: Maybe<Scalars["Int"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  maxUploadFileSize?: Maybe<Scalars["Int"]["output"]>;
  minUploadFileSize?: Maybe<Scalars["Int"]["output"]>;
  updatedAt?: Maybe<Scalars["timestamptz"]["output"]>;
};

/** response of any mutation on the table "storage.buckets" */
export type Buckets_Mutation_Response = {
  __typename?: "buckets_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Buckets>;
};

/** input type for inserting object relation for remote table "storage.buckets" */
export type Buckets_Obj_Rel_Insert_Input = {
  data: Buckets_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Buckets_On_Conflict>;
};

/** on_conflict condition type for table "storage.buckets" */
export type Buckets_On_Conflict = {
  constraint: Buckets_Constraint;
  update_columns?: Array<Buckets_Update_Column>;
  where?: InputMaybe<Buckets_Bool_Exp>;
};

/** Ordering options when selecting data from "storage.buckets". */
export type Buckets_Order_By = {
  cacheControl?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  downloadExpiration?: InputMaybe<Order_By>;
  files_aggregate?: InputMaybe<Files_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  maxUploadFileSize?: InputMaybe<Order_By>;
  minUploadFileSize?: InputMaybe<Order_By>;
  presignedUrlsEnabled?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: storage.buckets */
export type Buckets_Pk_Columns_Input = {
  id: Scalars["String"]["input"];
};

/** select columns of table "storage.buckets" */
export enum Buckets_Select_Column {
  /** column name */
  CacheControl = "cacheControl",
  /** column name */
  CreatedAt = "createdAt",
  /** column name */
  DownloadExpiration = "downloadExpiration",
  /** column name */
  Id = "id",
  /** column name */
  MaxUploadFileSize = "maxUploadFileSize",
  /** column name */
  MinUploadFileSize = "minUploadFileSize",
  /** column name */
  PresignedUrlsEnabled = "presignedUrlsEnabled",
  /** column name */
  UpdatedAt = "updatedAt",
}

/** input type for updating data in table "storage.buckets" */
export type Buckets_Set_Input = {
  cacheControl?: InputMaybe<Scalars["String"]["input"]>;
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  downloadExpiration?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  maxUploadFileSize?: InputMaybe<Scalars["Int"]["input"]>;
  minUploadFileSize?: InputMaybe<Scalars["Int"]["input"]>;
  presignedUrlsEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate stddev on columns */
export type Buckets_Stddev_Fields = {
  __typename?: "buckets_stddev_fields";
  downloadExpiration?: Maybe<Scalars["Float"]["output"]>;
  maxUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
  minUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Buckets_Stddev_Pop_Fields = {
  __typename?: "buckets_stddev_pop_fields";
  downloadExpiration?: Maybe<Scalars["Float"]["output"]>;
  maxUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
  minUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Buckets_Stddev_Samp_Fields = {
  __typename?: "buckets_stddev_samp_fields";
  downloadExpiration?: Maybe<Scalars["Float"]["output"]>;
  maxUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
  minUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "buckets" */
export type Buckets_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Buckets_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Buckets_Stream_Cursor_Value_Input = {
  cacheControl?: InputMaybe<Scalars["String"]["input"]>;
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  downloadExpiration?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  maxUploadFileSize?: InputMaybe<Scalars["Int"]["input"]>;
  minUploadFileSize?: InputMaybe<Scalars["Int"]["input"]>;
  presignedUrlsEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate sum on columns */
export type Buckets_Sum_Fields = {
  __typename?: "buckets_sum_fields";
  downloadExpiration?: Maybe<Scalars["Int"]["output"]>;
  maxUploadFileSize?: Maybe<Scalars["Int"]["output"]>;
  minUploadFileSize?: Maybe<Scalars["Int"]["output"]>;
};

/** update columns of table "storage.buckets" */
export enum Buckets_Update_Column {
  /** column name */
  CacheControl = "cacheControl",
  /** column name */
  CreatedAt = "createdAt",
  /** column name */
  DownloadExpiration = "downloadExpiration",
  /** column name */
  Id = "id",
  /** column name */
  MaxUploadFileSize = "maxUploadFileSize",
  /** column name */
  MinUploadFileSize = "minUploadFileSize",
  /** column name */
  PresignedUrlsEnabled = "presignedUrlsEnabled",
  /** column name */
  UpdatedAt = "updatedAt",
}

export type Buckets_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Buckets_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Buckets_Set_Input>;
  /** filter the rows which have to be updated */
  where: Buckets_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Buckets_Var_Pop_Fields = {
  __typename?: "buckets_var_pop_fields";
  downloadExpiration?: Maybe<Scalars["Float"]["output"]>;
  maxUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
  minUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Buckets_Var_Samp_Fields = {
  __typename?: "buckets_var_samp_fields";
  downloadExpiration?: Maybe<Scalars["Float"]["output"]>;
  maxUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
  minUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Buckets_Variance_Fields = {
  __typename?: "buckets_variance_fields";
  downloadExpiration?: Maybe<Scalars["Float"]["output"]>;
  maxUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
  minUploadFileSize?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to compare columns of type "bytea". All fields are combined with logical 'AND'. */
export type Bytea_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["bytea"]["input"]>;
  _gt?: InputMaybe<Scalars["bytea"]["input"]>;
  _gte?: InputMaybe<Scalars["bytea"]["input"]>;
  _in?: InputMaybe<Array<Scalars["bytea"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["bytea"]["input"]>;
  _lte?: InputMaybe<Scalars["bytea"]["input"]>;
  _neq?: InputMaybe<Scalars["bytea"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["bytea"]["input"]>>;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = "ASC",
  /** descending ordering of the cursor */
  Desc = "DESC",
}

/** columns and relationships of "daily_tasks" */
export type Daily_Tasks = {
  __typename?: "daily_tasks";
  ai_context?: Maybe<Scalars["jsonb"]["output"]>;
  ai_enabled?: Maybe<Scalars["Boolean"]["output"]>;
  completed_at?: Maybe<Scalars["timestamp"]["output"]>;
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  duration_minutes: Scalars["Int"]["output"];
  id: Scalars["uuid"]["output"];
  stage_id?: Maybe<Scalars["uuid"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  study_stage?: Maybe<Study_Stages>;
  suggested_prompt?: Maybe<Scalars["String"]["output"]>;
  task_date: Scalars["date"]["output"];
  title: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
  type_specific_payload?: Maybe<Scalars["jsonb"]["output"]>;
  /** An object relationship */
  user?: Maybe<Users>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** columns and relationships of "daily_tasks" */
export type Daily_TasksAi_ContextArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "daily_tasks" */
export type Daily_TasksType_Specific_PayloadArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "daily_tasks" */
export type Daily_Tasks_Aggregate = {
  __typename?: "daily_tasks_aggregate";
  aggregate?: Maybe<Daily_Tasks_Aggregate_Fields>;
  nodes: Array<Daily_Tasks>;
};

export type Daily_Tasks_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Daily_Tasks_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Daily_Tasks_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Daily_Tasks_Aggregate_Bool_Exp_Count>;
};

export type Daily_Tasks_Aggregate_Bool_Exp_Bool_And = {
  arguments: Daily_Tasks_Select_Column_Daily_Tasks_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Daily_Tasks_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Daily_Tasks_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Daily_Tasks_Select_Column_Daily_Tasks_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Daily_Tasks_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Daily_Tasks_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Daily_Tasks_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Daily_Tasks_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "daily_tasks" */
export type Daily_Tasks_Aggregate_Fields = {
  __typename?: "daily_tasks_aggregate_fields";
  avg?: Maybe<Daily_Tasks_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Daily_Tasks_Max_Fields>;
  min?: Maybe<Daily_Tasks_Min_Fields>;
  stddev?: Maybe<Daily_Tasks_Stddev_Fields>;
  stddev_pop?: Maybe<Daily_Tasks_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Daily_Tasks_Stddev_Samp_Fields>;
  sum?: Maybe<Daily_Tasks_Sum_Fields>;
  var_pop?: Maybe<Daily_Tasks_Var_Pop_Fields>;
  var_samp?: Maybe<Daily_Tasks_Var_Samp_Fields>;
  variance?: Maybe<Daily_Tasks_Variance_Fields>;
};

/** aggregate fields of "daily_tasks" */
export type Daily_Tasks_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Daily_Tasks_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "daily_tasks" */
export type Daily_Tasks_Aggregate_Order_By = {
  avg?: InputMaybe<Daily_Tasks_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Daily_Tasks_Max_Order_By>;
  min?: InputMaybe<Daily_Tasks_Min_Order_By>;
  stddev?: InputMaybe<Daily_Tasks_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Daily_Tasks_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Daily_Tasks_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Daily_Tasks_Sum_Order_By>;
  var_pop?: InputMaybe<Daily_Tasks_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Daily_Tasks_Var_Samp_Order_By>;
  variance?: InputMaybe<Daily_Tasks_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Daily_Tasks_Append_Input = {
  ai_context?: InputMaybe<Scalars["jsonb"]["input"]>;
  type_specific_payload?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "daily_tasks" */
export type Daily_Tasks_Arr_Rel_Insert_Input = {
  data: Array<Daily_Tasks_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Daily_Tasks_On_Conflict>;
};

/** aggregate avg on columns */
export type Daily_Tasks_Avg_Fields = {
  __typename?: "daily_tasks_avg_fields";
  duration_minutes?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "daily_tasks" */
export type Daily_Tasks_Avg_Order_By = {
  duration_minutes?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "daily_tasks". All fields are combined with a logical 'AND'. */
export type Daily_Tasks_Bool_Exp = {
  _and?: InputMaybe<Array<Daily_Tasks_Bool_Exp>>;
  _not?: InputMaybe<Daily_Tasks_Bool_Exp>;
  _or?: InputMaybe<Array<Daily_Tasks_Bool_Exp>>;
  ai_context?: InputMaybe<Jsonb_Comparison_Exp>;
  ai_enabled?: InputMaybe<Boolean_Comparison_Exp>;
  completed_at?: InputMaybe<Timestamp_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  duration_minutes?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  stage_id?: InputMaybe<Uuid_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  study_stage?: InputMaybe<Study_Stages_Bool_Exp>;
  suggested_prompt?: InputMaybe<String_Comparison_Exp>;
  task_date?: InputMaybe<Date_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  type_specific_payload?: InputMaybe<Jsonb_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "daily_tasks" */
export enum Daily_Tasks_Constraint {
  /** unique or primary key constraint on columns "id" */
  DailyTasksPkey = "daily_tasks_pkey",
  /** unique or primary key constraint on columns "user_id", "type", "task_date" */
  DailyTasksUserIdTaskDateTypeKey = "daily_tasks_user_id_task_date_type_key",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Daily_Tasks_Delete_At_Path_Input = {
  ai_context?: InputMaybe<Array<Scalars["String"]["input"]>>;
  type_specific_payload?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Daily_Tasks_Delete_Elem_Input = {
  ai_context?: InputMaybe<Scalars["Int"]["input"]>;
  type_specific_payload?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Daily_Tasks_Delete_Key_Input = {
  ai_context?: InputMaybe<Scalars["String"]["input"]>;
  type_specific_payload?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "daily_tasks" */
export type Daily_Tasks_Inc_Input = {
  duration_minutes?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "daily_tasks" */
export type Daily_Tasks_Insert_Input = {
  ai_context?: InputMaybe<Scalars["jsonb"]["input"]>;
  ai_enabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  completed_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  duration_minutes?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  stage_id?: InputMaybe<Scalars["uuid"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  study_stage?: InputMaybe<Study_Stages_Obj_Rel_Insert_Input>;
  suggested_prompt?: InputMaybe<Scalars["String"]["input"]>;
  task_date?: InputMaybe<Scalars["date"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
  type_specific_payload?: InputMaybe<Scalars["jsonb"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Daily_Tasks_Max_Fields = {
  __typename?: "daily_tasks_max_fields";
  completed_at?: Maybe<Scalars["timestamp"]["output"]>;
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  duration_minutes?: Maybe<Scalars["Int"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  stage_id?: Maybe<Scalars["uuid"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  suggested_prompt?: Maybe<Scalars["String"]["output"]>;
  task_date?: Maybe<Scalars["date"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  type?: Maybe<Scalars["String"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "daily_tasks" */
export type Daily_Tasks_Max_Order_By = {
  completed_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  duration_minutes?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  stage_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  suggested_prompt?: InputMaybe<Order_By>;
  task_date?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Daily_Tasks_Min_Fields = {
  __typename?: "daily_tasks_min_fields";
  completed_at?: Maybe<Scalars["timestamp"]["output"]>;
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  duration_minutes?: Maybe<Scalars["Int"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  stage_id?: Maybe<Scalars["uuid"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  suggested_prompt?: Maybe<Scalars["String"]["output"]>;
  task_date?: Maybe<Scalars["date"]["output"]>;
  title?: Maybe<Scalars["String"]["output"]>;
  type?: Maybe<Scalars["String"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "daily_tasks" */
export type Daily_Tasks_Min_Order_By = {
  completed_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  duration_minutes?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  stage_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  suggested_prompt?: InputMaybe<Order_By>;
  task_date?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "daily_tasks" */
export type Daily_Tasks_Mutation_Response = {
  __typename?: "daily_tasks_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Daily_Tasks>;
};

/** on_conflict condition type for table "daily_tasks" */
export type Daily_Tasks_On_Conflict = {
  constraint: Daily_Tasks_Constraint;
  update_columns?: Array<Daily_Tasks_Update_Column>;
  where?: InputMaybe<Daily_Tasks_Bool_Exp>;
};

/** Ordering options when selecting data from "daily_tasks". */
export type Daily_Tasks_Order_By = {
  ai_context?: InputMaybe<Order_By>;
  ai_enabled?: InputMaybe<Order_By>;
  completed_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  duration_minutes?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  stage_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  study_stage?: InputMaybe<Study_Stages_Order_By>;
  suggested_prompt?: InputMaybe<Order_By>;
  task_date?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  type_specific_payload?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: daily_tasks */
export type Daily_Tasks_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Daily_Tasks_Prepend_Input = {
  ai_context?: InputMaybe<Scalars["jsonb"]["input"]>;
  type_specific_payload?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "daily_tasks" */
export enum Daily_Tasks_Select_Column {
  /** column name */
  AiContext = "ai_context",
  /** column name */
  AiEnabled = "ai_enabled",
  /** column name */
  CompletedAt = "completed_at",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Description = "description",
  /** column name */
  DurationMinutes = "duration_minutes",
  /** column name */
  Id = "id",
  /** column name */
  StageId = "stage_id",
  /** column name */
  Status = "status",
  /** column name */
  SuggestedPrompt = "suggested_prompt",
  /** column name */
  TaskDate = "task_date",
  /** column name */
  Title = "title",
  /** column name */
  Type = "type",
  /** column name */
  TypeSpecificPayload = "type_specific_payload",
  /** column name */
  UserId = "user_id",
}

/** select "daily_tasks_aggregate_bool_exp_bool_and_arguments_columns" columns of table "daily_tasks" */
export enum Daily_Tasks_Select_Column_Daily_Tasks_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  AiEnabled = "ai_enabled",
}

/** select "daily_tasks_aggregate_bool_exp_bool_or_arguments_columns" columns of table "daily_tasks" */
export enum Daily_Tasks_Select_Column_Daily_Tasks_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  AiEnabled = "ai_enabled",
}

/** input type for updating data in table "daily_tasks" */
export type Daily_Tasks_Set_Input = {
  ai_context?: InputMaybe<Scalars["jsonb"]["input"]>;
  ai_enabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  completed_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  duration_minutes?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  stage_id?: InputMaybe<Scalars["uuid"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  suggested_prompt?: InputMaybe<Scalars["String"]["input"]>;
  task_date?: InputMaybe<Scalars["date"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
  type_specific_payload?: InputMaybe<Scalars["jsonb"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Daily_Tasks_Stddev_Fields = {
  __typename?: "daily_tasks_stddev_fields";
  duration_minutes?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "daily_tasks" */
export type Daily_Tasks_Stddev_Order_By = {
  duration_minutes?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Daily_Tasks_Stddev_Pop_Fields = {
  __typename?: "daily_tasks_stddev_pop_fields";
  duration_minutes?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "daily_tasks" */
export type Daily_Tasks_Stddev_Pop_Order_By = {
  duration_minutes?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Daily_Tasks_Stddev_Samp_Fields = {
  __typename?: "daily_tasks_stddev_samp_fields";
  duration_minutes?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "daily_tasks" */
export type Daily_Tasks_Stddev_Samp_Order_By = {
  duration_minutes?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "daily_tasks" */
export type Daily_Tasks_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Daily_Tasks_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Daily_Tasks_Stream_Cursor_Value_Input = {
  ai_context?: InputMaybe<Scalars["jsonb"]["input"]>;
  ai_enabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  completed_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  duration_minutes?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  stage_id?: InputMaybe<Scalars["uuid"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  suggested_prompt?: InputMaybe<Scalars["String"]["input"]>;
  task_date?: InputMaybe<Scalars["date"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
  type_specific_payload?: InputMaybe<Scalars["jsonb"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Daily_Tasks_Sum_Fields = {
  __typename?: "daily_tasks_sum_fields";
  duration_minutes?: Maybe<Scalars["Int"]["output"]>;
};

/** order by sum() on columns of table "daily_tasks" */
export type Daily_Tasks_Sum_Order_By = {
  duration_minutes?: InputMaybe<Order_By>;
};

/** update columns of table "daily_tasks" */
export enum Daily_Tasks_Update_Column {
  /** column name */
  AiContext = "ai_context",
  /** column name */
  AiEnabled = "ai_enabled",
  /** column name */
  CompletedAt = "completed_at",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Description = "description",
  /** column name */
  DurationMinutes = "duration_minutes",
  /** column name */
  Id = "id",
  /** column name */
  StageId = "stage_id",
  /** column name */
  Status = "status",
  /** column name */
  SuggestedPrompt = "suggested_prompt",
  /** column name */
  TaskDate = "task_date",
  /** column name */
  Title = "title",
  /** column name */
  Type = "type",
  /** column name */
  TypeSpecificPayload = "type_specific_payload",
  /** column name */
  UserId = "user_id",
}

export type Daily_Tasks_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Daily_Tasks_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Daily_Tasks_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Daily_Tasks_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Daily_Tasks_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Daily_Tasks_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Daily_Tasks_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Daily_Tasks_Set_Input>;
  /** filter the rows which have to be updated */
  where: Daily_Tasks_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Daily_Tasks_Var_Pop_Fields = {
  __typename?: "daily_tasks_var_pop_fields";
  duration_minutes?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "daily_tasks" */
export type Daily_Tasks_Var_Pop_Order_By = {
  duration_minutes?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Daily_Tasks_Var_Samp_Fields = {
  __typename?: "daily_tasks_var_samp_fields";
  duration_minutes?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "daily_tasks" */
export type Daily_Tasks_Var_Samp_Order_By = {
  duration_minutes?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Daily_Tasks_Variance_Fields = {
  __typename?: "daily_tasks_variance_fields";
  duration_minutes?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "daily_tasks" */
export type Daily_Tasks_Variance_Order_By = {
  duration_minutes?: InputMaybe<Order_By>;
};

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type Date_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["date"]["input"]>;
  _gt?: InputMaybe<Scalars["date"]["input"]>;
  _gte?: InputMaybe<Scalars["date"]["input"]>;
  _in?: InputMaybe<Array<Scalars["date"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["date"]["input"]>;
  _lte?: InputMaybe<Scalars["date"]["input"]>;
  _neq?: InputMaybe<Scalars["date"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["date"]["input"]>>;
};

/** columns and relationships of "debug" */
export type Debug = {
  __typename?: "debug";
  created_at: Scalars["bigint"]["output"];
  id: Scalars["uuid"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** Debug value data */
  value?: Maybe<Scalars["jsonb"]["output"]>;
};

/** columns and relationships of "debug" */
export type DebugValueArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "debug" */
export type Debug_Aggregate = {
  __typename?: "debug_aggregate";
  aggregate?: Maybe<Debug_Aggregate_Fields>;
  nodes: Array<Debug>;
};

/** aggregate fields of "debug" */
export type Debug_Aggregate_Fields = {
  __typename?: "debug_aggregate_fields";
  avg?: Maybe<Debug_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Debug_Max_Fields>;
  min?: Maybe<Debug_Min_Fields>;
  stddev?: Maybe<Debug_Stddev_Fields>;
  stddev_pop?: Maybe<Debug_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Debug_Stddev_Samp_Fields>;
  sum?: Maybe<Debug_Sum_Fields>;
  var_pop?: Maybe<Debug_Var_Pop_Fields>;
  var_samp?: Maybe<Debug_Var_Samp_Fields>;
  variance?: Maybe<Debug_Variance_Fields>;
};

/** aggregate fields of "debug" */
export type Debug_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Debug_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Debug_Append_Input = {
  /** Debug value data */
  value?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate avg on columns */
export type Debug_Avg_Fields = {
  __typename?: "debug_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "debug". All fields are combined with a logical 'AND'. */
export type Debug_Bool_Exp = {
  _and?: InputMaybe<Array<Debug_Bool_Exp>>;
  _not?: InputMaybe<Debug_Bool_Exp>;
  _or?: InputMaybe<Array<Debug_Bool_Exp>>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  value?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "debug" */
export enum Debug_Constraint {
  /** unique or primary key constraint on columns "id" */
  DebugPkey = "debug_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Debug_Delete_At_Path_Input = {
  /** Debug value data */
  value?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Debug_Delete_Elem_Input = {
  /** Debug value data */
  value?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Debug_Delete_Key_Input = {
  /** Debug value data */
  value?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "debug" */
export type Debug_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "debug" */
export type Debug_Insert_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Debug value data */
  value?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate max on columns */
export type Debug_Max_Fields = {
  __typename?: "debug_max_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** aggregate min on columns */
export type Debug_Min_Fields = {
  __typename?: "debug_min_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** response of any mutation on the table "debug" */
export type Debug_Mutation_Response = {
  __typename?: "debug_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Debug>;
};

/** on_conflict condition type for table "debug" */
export type Debug_On_Conflict = {
  constraint: Debug_Constraint;
  update_columns?: Array<Debug_Update_Column>;
  where?: InputMaybe<Debug_Bool_Exp>;
};

/** Ordering options when selecting data from "debug". */
export type Debug_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: debug */
export type Debug_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Debug_Prepend_Input = {
  /** Debug value data */
  value?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "debug" */
export enum Debug_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  Value = "value",
}

/** input type for updating data in table "debug" */
export type Debug_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Debug value data */
  value?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate stddev on columns */
export type Debug_Stddev_Fields = {
  __typename?: "debug_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Debug_Stddev_Pop_Fields = {
  __typename?: "debug_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Debug_Stddev_Samp_Fields = {
  __typename?: "debug_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "debug" */
export type Debug_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Debug_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Debug_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Debug value data */
  value?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate sum on columns */
export type Debug_Sum_Fields = {
  __typename?: "debug_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** update columns of table "debug" */
export enum Debug_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  Value = "value",
}

export type Debug_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Debug_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Debug_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Debug_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Debug_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Debug_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Debug_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Debug_Set_Input>;
  /** filter the rows which have to be updated */
  where: Debug_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Debug_Var_Pop_Fields = {
  __typename?: "debug_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Debug_Var_Samp_Fields = {
  __typename?: "debug_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Debug_Variance_Fields = {
  __typename?: "debug_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "error_log" */
export type Error_Log = {
  __typename?: "error_log";
  category: Scalars["String"]["output"];
  correction: Scalars["String"]["output"];
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  date?: Maybe<Scalars["date"]["output"]>;
  id: Scalars["uuid"]["output"];
  mistake: Scalars["String"]["output"];
  next_review_date?: Maybe<Scalars["date"]["output"]>;
  notes?: Maybe<Scalars["String"]["output"]>;
  review_count?: Maybe<Scalars["Int"]["output"]>;
  reviewed?: Maybe<Scalars["Boolean"]["output"]>;
  subcategory?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  user?: Maybe<Users>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregated selection of "error_log" */
export type Error_Log_Aggregate = {
  __typename?: "error_log_aggregate";
  aggregate?: Maybe<Error_Log_Aggregate_Fields>;
  nodes: Array<Error_Log>;
};

export type Error_Log_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Error_Log_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Error_Log_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Error_Log_Aggregate_Bool_Exp_Count>;
};

export type Error_Log_Aggregate_Bool_Exp_Bool_And = {
  arguments: Error_Log_Select_Column_Error_Log_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Error_Log_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Error_Log_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Error_Log_Select_Column_Error_Log_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Error_Log_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Error_Log_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Error_Log_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Error_Log_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "error_log" */
export type Error_Log_Aggregate_Fields = {
  __typename?: "error_log_aggregate_fields";
  avg?: Maybe<Error_Log_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Error_Log_Max_Fields>;
  min?: Maybe<Error_Log_Min_Fields>;
  stddev?: Maybe<Error_Log_Stddev_Fields>;
  stddev_pop?: Maybe<Error_Log_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Error_Log_Stddev_Samp_Fields>;
  sum?: Maybe<Error_Log_Sum_Fields>;
  var_pop?: Maybe<Error_Log_Var_Pop_Fields>;
  var_samp?: Maybe<Error_Log_Var_Samp_Fields>;
  variance?: Maybe<Error_Log_Variance_Fields>;
};

/** aggregate fields of "error_log" */
export type Error_Log_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Error_Log_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "error_log" */
export type Error_Log_Aggregate_Order_By = {
  avg?: InputMaybe<Error_Log_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Error_Log_Max_Order_By>;
  min?: InputMaybe<Error_Log_Min_Order_By>;
  stddev?: InputMaybe<Error_Log_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Error_Log_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Error_Log_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Error_Log_Sum_Order_By>;
  var_pop?: InputMaybe<Error_Log_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Error_Log_Var_Samp_Order_By>;
  variance?: InputMaybe<Error_Log_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "error_log" */
export type Error_Log_Arr_Rel_Insert_Input = {
  data: Array<Error_Log_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Error_Log_On_Conflict>;
};

/** aggregate avg on columns */
export type Error_Log_Avg_Fields = {
  __typename?: "error_log_avg_fields";
  review_count?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "error_log" */
export type Error_Log_Avg_Order_By = {
  review_count?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "error_log". All fields are combined with a logical 'AND'. */
export type Error_Log_Bool_Exp = {
  _and?: InputMaybe<Array<Error_Log_Bool_Exp>>;
  _not?: InputMaybe<Error_Log_Bool_Exp>;
  _or?: InputMaybe<Array<Error_Log_Bool_Exp>>;
  category?: InputMaybe<String_Comparison_Exp>;
  correction?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  date?: InputMaybe<Date_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  mistake?: InputMaybe<String_Comparison_Exp>;
  next_review_date?: InputMaybe<Date_Comparison_Exp>;
  notes?: InputMaybe<String_Comparison_Exp>;
  review_count?: InputMaybe<Int_Comparison_Exp>;
  reviewed?: InputMaybe<Boolean_Comparison_Exp>;
  subcategory?: InputMaybe<String_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "error_log" */
export enum Error_Log_Constraint {
  /** unique or primary key constraint on columns "id" */
  ErrorLogPkey = "error_log_pkey",
}

/** input type for incrementing numeric columns in table "error_log" */
export type Error_Log_Inc_Input = {
  review_count?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "error_log" */
export type Error_Log_Insert_Input = {
  category?: InputMaybe<Scalars["String"]["input"]>;
  correction?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  date?: InputMaybe<Scalars["date"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  mistake?: InputMaybe<Scalars["String"]["input"]>;
  next_review_date?: InputMaybe<Scalars["date"]["input"]>;
  notes?: InputMaybe<Scalars["String"]["input"]>;
  review_count?: InputMaybe<Scalars["Int"]["input"]>;
  reviewed?: InputMaybe<Scalars["Boolean"]["input"]>;
  subcategory?: InputMaybe<Scalars["String"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Error_Log_Max_Fields = {
  __typename?: "error_log_max_fields";
  category?: Maybe<Scalars["String"]["output"]>;
  correction?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  date?: Maybe<Scalars["date"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  mistake?: Maybe<Scalars["String"]["output"]>;
  next_review_date?: Maybe<Scalars["date"]["output"]>;
  notes?: Maybe<Scalars["String"]["output"]>;
  review_count?: Maybe<Scalars["Int"]["output"]>;
  subcategory?: Maybe<Scalars["String"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "error_log" */
export type Error_Log_Max_Order_By = {
  category?: InputMaybe<Order_By>;
  correction?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mistake?: InputMaybe<Order_By>;
  next_review_date?: InputMaybe<Order_By>;
  notes?: InputMaybe<Order_By>;
  review_count?: InputMaybe<Order_By>;
  subcategory?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Error_Log_Min_Fields = {
  __typename?: "error_log_min_fields";
  category?: Maybe<Scalars["String"]["output"]>;
  correction?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  date?: Maybe<Scalars["date"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  mistake?: Maybe<Scalars["String"]["output"]>;
  next_review_date?: Maybe<Scalars["date"]["output"]>;
  notes?: Maybe<Scalars["String"]["output"]>;
  review_count?: Maybe<Scalars["Int"]["output"]>;
  subcategory?: Maybe<Scalars["String"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "error_log" */
export type Error_Log_Min_Order_By = {
  category?: InputMaybe<Order_By>;
  correction?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mistake?: InputMaybe<Order_By>;
  next_review_date?: InputMaybe<Order_By>;
  notes?: InputMaybe<Order_By>;
  review_count?: InputMaybe<Order_By>;
  subcategory?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "error_log" */
export type Error_Log_Mutation_Response = {
  __typename?: "error_log_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Error_Log>;
};

/** on_conflict condition type for table "error_log" */
export type Error_Log_On_Conflict = {
  constraint: Error_Log_Constraint;
  update_columns?: Array<Error_Log_Update_Column>;
  where?: InputMaybe<Error_Log_Bool_Exp>;
};

/** Ordering options when selecting data from "error_log". */
export type Error_Log_Order_By = {
  category?: InputMaybe<Order_By>;
  correction?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mistake?: InputMaybe<Order_By>;
  next_review_date?: InputMaybe<Order_By>;
  notes?: InputMaybe<Order_By>;
  review_count?: InputMaybe<Order_By>;
  reviewed?: InputMaybe<Order_By>;
  subcategory?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: error_log */
export type Error_Log_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "error_log" */
export enum Error_Log_Select_Column {
  /** column name */
  Category = "category",
  /** column name */
  Correction = "correction",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Date = "date",
  /** column name */
  Id = "id",
  /** column name */
  Mistake = "mistake",
  /** column name */
  NextReviewDate = "next_review_date",
  /** column name */
  Notes = "notes",
  /** column name */
  ReviewCount = "review_count",
  /** column name */
  Reviewed = "reviewed",
  /** column name */
  Subcategory = "subcategory",
  /** column name */
  UserId = "user_id",
}

/** select "error_log_aggregate_bool_exp_bool_and_arguments_columns" columns of table "error_log" */
export enum Error_Log_Select_Column_Error_Log_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Reviewed = "reviewed",
}

/** select "error_log_aggregate_bool_exp_bool_or_arguments_columns" columns of table "error_log" */
export enum Error_Log_Select_Column_Error_Log_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Reviewed = "reviewed",
}

/** input type for updating data in table "error_log" */
export type Error_Log_Set_Input = {
  category?: InputMaybe<Scalars["String"]["input"]>;
  correction?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  date?: InputMaybe<Scalars["date"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  mistake?: InputMaybe<Scalars["String"]["input"]>;
  next_review_date?: InputMaybe<Scalars["date"]["input"]>;
  notes?: InputMaybe<Scalars["String"]["input"]>;
  review_count?: InputMaybe<Scalars["Int"]["input"]>;
  reviewed?: InputMaybe<Scalars["Boolean"]["input"]>;
  subcategory?: InputMaybe<Scalars["String"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Error_Log_Stddev_Fields = {
  __typename?: "error_log_stddev_fields";
  review_count?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "error_log" */
export type Error_Log_Stddev_Order_By = {
  review_count?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Error_Log_Stddev_Pop_Fields = {
  __typename?: "error_log_stddev_pop_fields";
  review_count?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "error_log" */
export type Error_Log_Stddev_Pop_Order_By = {
  review_count?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Error_Log_Stddev_Samp_Fields = {
  __typename?: "error_log_stddev_samp_fields";
  review_count?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "error_log" */
export type Error_Log_Stddev_Samp_Order_By = {
  review_count?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "error_log" */
export type Error_Log_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Error_Log_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Error_Log_Stream_Cursor_Value_Input = {
  category?: InputMaybe<Scalars["String"]["input"]>;
  correction?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  date?: InputMaybe<Scalars["date"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  mistake?: InputMaybe<Scalars["String"]["input"]>;
  next_review_date?: InputMaybe<Scalars["date"]["input"]>;
  notes?: InputMaybe<Scalars["String"]["input"]>;
  review_count?: InputMaybe<Scalars["Int"]["input"]>;
  reviewed?: InputMaybe<Scalars["Boolean"]["input"]>;
  subcategory?: InputMaybe<Scalars["String"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Error_Log_Sum_Fields = {
  __typename?: "error_log_sum_fields";
  review_count?: Maybe<Scalars["Int"]["output"]>;
};

/** order by sum() on columns of table "error_log" */
export type Error_Log_Sum_Order_By = {
  review_count?: InputMaybe<Order_By>;
};

/** update columns of table "error_log" */
export enum Error_Log_Update_Column {
  /** column name */
  Category = "category",
  /** column name */
  Correction = "correction",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Date = "date",
  /** column name */
  Id = "id",
  /** column name */
  Mistake = "mistake",
  /** column name */
  NextReviewDate = "next_review_date",
  /** column name */
  Notes = "notes",
  /** column name */
  ReviewCount = "review_count",
  /** column name */
  Reviewed = "reviewed",
  /** column name */
  Subcategory = "subcategory",
  /** column name */
  UserId = "user_id",
}

export type Error_Log_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Error_Log_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Error_Log_Set_Input>;
  /** filter the rows which have to be updated */
  where: Error_Log_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Error_Log_Var_Pop_Fields = {
  __typename?: "error_log_var_pop_fields";
  review_count?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "error_log" */
export type Error_Log_Var_Pop_Order_By = {
  review_count?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Error_Log_Var_Samp_Fields = {
  __typename?: "error_log_var_samp_fields";
  review_count?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "error_log" */
export type Error_Log_Var_Samp_Order_By = {
  review_count?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Error_Log_Variance_Fields = {
  __typename?: "error_log_variance_fields";
  review_count?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "error_log" */
export type Error_Log_Variance_Order_By = {
  review_count?: InputMaybe<Order_By>;
};

/** columns and relationships of "storage.files" */
export type Files = {
  __typename?: "files";
  /** An object relationship */
  bucket: Buckets;
  bucketId: Scalars["String"]["output"];
  createdAt: Scalars["timestamptz"]["output"];
  etag?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["uuid"]["output"];
  isUploaded?: Maybe<Scalars["Boolean"]["output"]>;
  metadata?: Maybe<Scalars["jsonb"]["output"]>;
  mimeType?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  size?: Maybe<Scalars["Int"]["output"]>;
  updatedAt: Scalars["timestamptz"]["output"];
  uploadedByUserId?: Maybe<Scalars["uuid"]["output"]>;
};

/** columns and relationships of "storage.files" */
export type FilesMetadataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "storage.files_blob" */
export type FilesBlob = {
  __typename?: "filesBlob";
  content: Scalars["bytea"]["output"];
  fileId: Scalars["uuid"]["output"];
};

/** aggregated selection of "storage.files_blob" */
export type FilesBlob_Aggregate = {
  __typename?: "filesBlob_aggregate";
  aggregate?: Maybe<FilesBlob_Aggregate_Fields>;
  nodes: Array<FilesBlob>;
};

/** aggregate fields of "storage.files_blob" */
export type FilesBlob_Aggregate_Fields = {
  __typename?: "filesBlob_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<FilesBlob_Max_Fields>;
  min?: Maybe<FilesBlob_Min_Fields>;
};

/** aggregate fields of "storage.files_blob" */
export type FilesBlob_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<FilesBlob_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** Boolean expression to filter rows from the table "storage.files_blob". All fields are combined with a logical 'AND'. */
export type FilesBlob_Bool_Exp = {
  _and?: InputMaybe<Array<FilesBlob_Bool_Exp>>;
  _not?: InputMaybe<FilesBlob_Bool_Exp>;
  _or?: InputMaybe<Array<FilesBlob_Bool_Exp>>;
  content?: InputMaybe<Bytea_Comparison_Exp>;
  fileId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "storage.files_blob" */
export enum FilesBlob_Constraint {
  /** unique or primary key constraint on columns "file_id" */
  FilesBlobPkey = "files_blob_pkey",
}

/** input type for inserting data into table "storage.files_blob" */
export type FilesBlob_Insert_Input = {
  content?: InputMaybe<Scalars["bytea"]["input"]>;
  fileId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type FilesBlob_Max_Fields = {
  __typename?: "filesBlob_max_fields";
  fileId?: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregate min on columns */
export type FilesBlob_Min_Fields = {
  __typename?: "filesBlob_min_fields";
  fileId?: Maybe<Scalars["uuid"]["output"]>;
};

/** response of any mutation on the table "storage.files_blob" */
export type FilesBlob_Mutation_Response = {
  __typename?: "filesBlob_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<FilesBlob>;
};

/** on_conflict condition type for table "storage.files_blob" */
export type FilesBlob_On_Conflict = {
  constraint: FilesBlob_Constraint;
  update_columns?: Array<FilesBlob_Update_Column>;
  where?: InputMaybe<FilesBlob_Bool_Exp>;
};

/** Ordering options when selecting data from "storage.files_blob". */
export type FilesBlob_Order_By = {
  content?: InputMaybe<Order_By>;
  fileId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: storage.files_blob */
export type FilesBlob_Pk_Columns_Input = {
  fileId: Scalars["uuid"]["input"];
};

/** select columns of table "storage.files_blob" */
export enum FilesBlob_Select_Column {
  /** column name */
  Content = "content",
  /** column name */
  FileId = "fileId",
}

/** input type for updating data in table "storage.files_blob" */
export type FilesBlob_Set_Input = {
  content?: InputMaybe<Scalars["bytea"]["input"]>;
  fileId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** Streaming cursor of the table "filesBlob" */
export type FilesBlob_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: FilesBlob_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type FilesBlob_Stream_Cursor_Value_Input = {
  content?: InputMaybe<Scalars["bytea"]["input"]>;
  fileId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "storage.files_blob" */
export enum FilesBlob_Update_Column {
  /** column name */
  Content = "content",
  /** column name */
  FileId = "fileId",
}

export type FilesBlob_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<FilesBlob_Set_Input>;
  /** filter the rows which have to be updated */
  where: FilesBlob_Bool_Exp;
};

/** aggregated selection of "storage.files" */
export type Files_Aggregate = {
  __typename?: "files_aggregate";
  aggregate?: Maybe<Files_Aggregate_Fields>;
  nodes: Array<Files>;
};

export type Files_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Files_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Files_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Files_Aggregate_Bool_Exp_Count>;
};

export type Files_Aggregate_Bool_Exp_Bool_And = {
  arguments: Files_Select_Column_Files_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Files_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Files_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Files_Select_Column_Files_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Files_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Files_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Files_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Files_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "storage.files" */
export type Files_Aggregate_Fields = {
  __typename?: "files_aggregate_fields";
  avg?: Maybe<Files_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Files_Max_Fields>;
  min?: Maybe<Files_Min_Fields>;
  stddev?: Maybe<Files_Stddev_Fields>;
  stddev_pop?: Maybe<Files_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Files_Stddev_Samp_Fields>;
  sum?: Maybe<Files_Sum_Fields>;
  var_pop?: Maybe<Files_Var_Pop_Fields>;
  var_samp?: Maybe<Files_Var_Samp_Fields>;
  variance?: Maybe<Files_Variance_Fields>;
};

/** aggregate fields of "storage.files" */
export type Files_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Files_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "storage.files" */
export type Files_Aggregate_Order_By = {
  avg?: InputMaybe<Files_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Files_Max_Order_By>;
  min?: InputMaybe<Files_Min_Order_By>;
  stddev?: InputMaybe<Files_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Files_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Files_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Files_Sum_Order_By>;
  var_pop?: InputMaybe<Files_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Files_Var_Samp_Order_By>;
  variance?: InputMaybe<Files_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Files_Append_Input = {
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "storage.files" */
export type Files_Arr_Rel_Insert_Input = {
  data: Array<Files_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Files_On_Conflict>;
};

/** aggregate avg on columns */
export type Files_Avg_Fields = {
  __typename?: "files_avg_fields";
  size?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "storage.files" */
export type Files_Avg_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "storage.files". All fields are combined with a logical 'AND'. */
export type Files_Bool_Exp = {
  _and?: InputMaybe<Array<Files_Bool_Exp>>;
  _not?: InputMaybe<Files_Bool_Exp>;
  _or?: InputMaybe<Array<Files_Bool_Exp>>;
  bucket?: InputMaybe<Buckets_Bool_Exp>;
  bucketId?: InputMaybe<String_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  etag?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  isUploaded?: InputMaybe<Boolean_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  mimeType?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  size?: InputMaybe<Int_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  uploadedByUserId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "storage.files" */
export enum Files_Constraint {
  /** unique or primary key constraint on columns "id" */
  FilesPkey = "files_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Files_Delete_At_Path_Input = {
  metadata?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Files_Delete_Elem_Input = {
  metadata?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Files_Delete_Key_Input = {
  metadata?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "storage.files" */
export type Files_Inc_Input = {
  size?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "storage.files" */
export type Files_Insert_Input = {
  bucket?: InputMaybe<Buckets_Obj_Rel_Insert_Input>;
  bucketId?: InputMaybe<Scalars["String"]["input"]>;
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  etag?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  isUploaded?: InputMaybe<Scalars["Boolean"]["input"]>;
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  mimeType?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  size?: InputMaybe<Scalars["Int"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  uploadedByUserId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Files_Max_Fields = {
  __typename?: "files_max_fields";
  bucketId?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["timestamptz"]["output"]>;
  etag?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  mimeType?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  size?: Maybe<Scalars["Int"]["output"]>;
  updatedAt?: Maybe<Scalars["timestamptz"]["output"]>;
  uploadedByUserId?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "storage.files" */
export type Files_Max_Order_By = {
  bucketId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  etag?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mimeType?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  size?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  uploadedByUserId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Files_Min_Fields = {
  __typename?: "files_min_fields";
  bucketId?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["timestamptz"]["output"]>;
  etag?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  mimeType?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  size?: Maybe<Scalars["Int"]["output"]>;
  updatedAt?: Maybe<Scalars["timestamptz"]["output"]>;
  uploadedByUserId?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "storage.files" */
export type Files_Min_Order_By = {
  bucketId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  etag?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mimeType?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  size?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  uploadedByUserId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "storage.files" */
export type Files_Mutation_Response = {
  __typename?: "files_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Files>;
};

/** input type for inserting object relation for remote table "storage.files" */
export type Files_Obj_Rel_Insert_Input = {
  data: Files_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Files_On_Conflict>;
};

/** on_conflict condition type for table "storage.files" */
export type Files_On_Conflict = {
  constraint: Files_Constraint;
  update_columns?: Array<Files_Update_Column>;
  where?: InputMaybe<Files_Bool_Exp>;
};

/** Ordering options when selecting data from "storage.files". */
export type Files_Order_By = {
  bucket?: InputMaybe<Buckets_Order_By>;
  bucketId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  etag?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  isUploaded?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  mimeType?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  size?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  uploadedByUserId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: storage.files */
export type Files_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Files_Prepend_Input = {
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "storage.files" */
export enum Files_Select_Column {
  /** column name */
  BucketId = "bucketId",
  /** column name */
  CreatedAt = "createdAt",
  /** column name */
  Etag = "etag",
  /** column name */
  Id = "id",
  /** column name */
  IsUploaded = "isUploaded",
  /** column name */
  Metadata = "metadata",
  /** column name */
  MimeType = "mimeType",
  /** column name */
  Name = "name",
  /** column name */
  Size = "size",
  /** column name */
  UpdatedAt = "updatedAt",
  /** column name */
  UploadedByUserId = "uploadedByUserId",
}

/** select "files_aggregate_bool_exp_bool_and_arguments_columns" columns of table "storage.files" */
export enum Files_Select_Column_Files_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsUploaded = "isUploaded",
}

/** select "files_aggregate_bool_exp_bool_or_arguments_columns" columns of table "storage.files" */
export enum Files_Select_Column_Files_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsUploaded = "isUploaded",
}

/** input type for updating data in table "storage.files" */
export type Files_Set_Input = {
  bucketId?: InputMaybe<Scalars["String"]["input"]>;
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  etag?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  isUploaded?: InputMaybe<Scalars["Boolean"]["input"]>;
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  mimeType?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  size?: InputMaybe<Scalars["Int"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  uploadedByUserId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Files_Stddev_Fields = {
  __typename?: "files_stddev_fields";
  size?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "storage.files" */
export type Files_Stddev_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Files_Stddev_Pop_Fields = {
  __typename?: "files_stddev_pop_fields";
  size?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "storage.files" */
export type Files_Stddev_Pop_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Files_Stddev_Samp_Fields = {
  __typename?: "files_stddev_samp_fields";
  size?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "storage.files" */
export type Files_Stddev_Samp_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "files" */
export type Files_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Files_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Files_Stream_Cursor_Value_Input = {
  bucketId?: InputMaybe<Scalars["String"]["input"]>;
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  etag?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  isUploaded?: InputMaybe<Scalars["Boolean"]["input"]>;
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  mimeType?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  size?: InputMaybe<Scalars["Int"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  uploadedByUserId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Files_Sum_Fields = {
  __typename?: "files_sum_fields";
  size?: Maybe<Scalars["Int"]["output"]>;
};

/** order by sum() on columns of table "storage.files" */
export type Files_Sum_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** update columns of table "storage.files" */
export enum Files_Update_Column {
  /** column name */
  BucketId = "bucketId",
  /** column name */
  CreatedAt = "createdAt",
  /** column name */
  Etag = "etag",
  /** column name */
  Id = "id",
  /** column name */
  IsUploaded = "isUploaded",
  /** column name */
  Metadata = "metadata",
  /** column name */
  MimeType = "mimeType",
  /** column name */
  Name = "name",
  /** column name */
  Size = "size",
  /** column name */
  UpdatedAt = "updatedAt",
  /** column name */
  UploadedByUserId = "uploadedByUserId",
}

export type Files_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Files_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Files_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Files_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Files_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Files_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Files_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Files_Set_Input>;
  /** filter the rows which have to be updated */
  where: Files_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Files_Var_Pop_Fields = {
  __typename?: "files_var_pop_fields";
  size?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "storage.files" */
export type Files_Var_Pop_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Files_Var_Samp_Fields = {
  __typename?: "files_var_samp_fields";
  size?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "storage.files" */
export type Files_Var_Samp_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Files_Variance_Fields = {
  __typename?: "files_variance_fields";
  size?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "storage.files" */
export type Files_Variance_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** columns and relationships of "github_issues" */
export type Github_Issues = {
  __typename?: "github_issues";
  /** User ID who created/modified the issue (set by trigger) */
  _user_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Reason for locking the issue */
  active_lock_reason?: Maybe<Scalars["String"]["output"]>;
  /** GitHub user assigned to the issue */
  assignee_data?: Maybe<Scalars["jsonb"]["output"]>;
  /** Array of GitHub users assigned to the issue */
  assignees_data?: Maybe<Scalars["jsonb"]["output"]>;
  /** Author association with repository */
  author_association?: Maybe<Scalars["String"]["output"]>;
  /** Issue body/description */
  body?: Maybe<Scalars["String"]["output"]>;
  /** When the issue was closed (unix timestamp) */
  closed_at?: Maybe<Scalars["bigint"]["output"]>;
  /** GitHub user who closed the issue */
  closed_by_data?: Maybe<Scalars["jsonb"]["output"]>;
  /** Number of comments on the issue */
  comments_count: Scalars["Int"]["output"];
  created_at: Scalars["bigint"]["output"];
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: Maybe<Scalars["bigint"]["output"]>;
  /** GitHub web URL for the issue */
  html_url: Scalars["String"]["output"];
  id: Scalars["uuid"]["output"];
  /** Array of labels attached to the issue */
  labels_data?: Maybe<Scalars["jsonb"]["output"]>;
  /** Whether issue is locked */
  locked: Scalars["Boolean"]["output"];
  /** Milestone data if assigned */
  milestone_data?: Maybe<Scalars["jsonb"]["output"]>;
  /** GitHub GraphQL node ID */
  node_id: Scalars["String"]["output"];
  /** Issue number in repository (nullable for user-created issues) */
  number?: Maybe<Scalars["Int"]["output"]>;
  /** Pull request data if issue is a PR */
  pull_request_data?: Maybe<Scalars["jsonb"]["output"]>;
  /** Repository name */
  repository_name: Scalars["String"]["output"];
  /** Repository owner name */
  repository_owner: Scalars["String"]["output"];
  /** Issue state: open, closed */
  state: Scalars["String"]["output"];
  /** Reason for state change */
  state_reason?: Maybe<Scalars["String"]["output"]>;
  /** Issue title */
  title: Scalars["String"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** GitHub API URL for the issue */
  url: Scalars["String"]["output"];
  /** GitHub user who created the issue */
  user_data?: Maybe<Scalars["jsonb"]["output"]>;
};

/** columns and relationships of "github_issues" */
export type Github_IssuesAssignee_DataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "github_issues" */
export type Github_IssuesAssignees_DataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "github_issues" */
export type Github_IssuesClosed_By_DataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "github_issues" */
export type Github_IssuesLabels_DataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "github_issues" */
export type Github_IssuesMilestone_DataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "github_issues" */
export type Github_IssuesPull_Request_DataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "github_issues" */
export type Github_IssuesUser_DataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "github_issues" */
export type Github_Issues_Aggregate = {
  __typename?: "github_issues_aggregate";
  aggregate?: Maybe<Github_Issues_Aggregate_Fields>;
  nodes: Array<Github_Issues>;
};

/** aggregate fields of "github_issues" */
export type Github_Issues_Aggregate_Fields = {
  __typename?: "github_issues_aggregate_fields";
  avg?: Maybe<Github_Issues_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Github_Issues_Max_Fields>;
  min?: Maybe<Github_Issues_Min_Fields>;
  stddev?: Maybe<Github_Issues_Stddev_Fields>;
  stddev_pop?: Maybe<Github_Issues_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Github_Issues_Stddev_Samp_Fields>;
  sum?: Maybe<Github_Issues_Sum_Fields>;
  var_pop?: Maybe<Github_Issues_Var_Pop_Fields>;
  var_samp?: Maybe<Github_Issues_Var_Samp_Fields>;
  variance?: Maybe<Github_Issues_Variance_Fields>;
};

/** aggregate fields of "github_issues" */
export type Github_Issues_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Github_Issues_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Github_Issues_Append_Input = {
  /** GitHub user assigned to the issue */
  assignee_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Array of GitHub users assigned to the issue */
  assignees_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** GitHub user who closed the issue */
  closed_by_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Array of labels attached to the issue */
  labels_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Milestone data if assigned */
  milestone_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Pull request data if issue is a PR */
  pull_request_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** GitHub user who created the issue */
  user_data?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate avg on columns */
export type Github_Issues_Avg_Fields = {
  __typename?: "github_issues_avg_fields";
  /** When the issue was closed (unix timestamp) */
  closed_at?: Maybe<Scalars["Float"]["output"]>;
  /** Number of comments on the issue */
  comments_count?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: Maybe<Scalars["Float"]["output"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "github_issues". All fields are combined with a logical 'AND'. */
export type Github_Issues_Bool_Exp = {
  _and?: InputMaybe<Array<Github_Issues_Bool_Exp>>;
  _not?: InputMaybe<Github_Issues_Bool_Exp>;
  _or?: InputMaybe<Array<Github_Issues_Bool_Exp>>;
  _user_id?: InputMaybe<Uuid_Comparison_Exp>;
  active_lock_reason?: InputMaybe<String_Comparison_Exp>;
  assignee_data?: InputMaybe<Jsonb_Comparison_Exp>;
  assignees_data?: InputMaybe<Jsonb_Comparison_Exp>;
  author_association?: InputMaybe<String_Comparison_Exp>;
  body?: InputMaybe<String_Comparison_Exp>;
  closed_at?: InputMaybe<Bigint_Comparison_Exp>;
  closed_by_data?: InputMaybe<Jsonb_Comparison_Exp>;
  comments_count?: InputMaybe<Int_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  github_id?: InputMaybe<Bigint_Comparison_Exp>;
  html_url?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  labels_data?: InputMaybe<Jsonb_Comparison_Exp>;
  locked?: InputMaybe<Boolean_Comparison_Exp>;
  milestone_data?: InputMaybe<Jsonb_Comparison_Exp>;
  node_id?: InputMaybe<String_Comparison_Exp>;
  number?: InputMaybe<Int_Comparison_Exp>;
  pull_request_data?: InputMaybe<Jsonb_Comparison_Exp>;
  repository_name?: InputMaybe<String_Comparison_Exp>;
  repository_owner?: InputMaybe<String_Comparison_Exp>;
  state?: InputMaybe<String_Comparison_Exp>;
  state_reason?: InputMaybe<String_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  url?: InputMaybe<String_Comparison_Exp>;
  user_data?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "github_issues" */
export enum Github_Issues_Constraint {
  /** unique or primary key constraint on columns "github_id" */
  GithubIssuesGithubIdKey = "github_issues_github_id_key",
  /** unique or primary key constraint on columns "id" */
  GithubIssuesPkey = "github_issues_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Github_Issues_Delete_At_Path_Input = {
  /** GitHub user assigned to the issue */
  assignee_data?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Array of GitHub users assigned to the issue */
  assignees_data?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** GitHub user who closed the issue */
  closed_by_data?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Array of labels attached to the issue */
  labels_data?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Milestone data if assigned */
  milestone_data?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Pull request data if issue is a PR */
  pull_request_data?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** GitHub user who created the issue */
  user_data?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Github_Issues_Delete_Elem_Input = {
  /** GitHub user assigned to the issue */
  assignee_data?: InputMaybe<Scalars["Int"]["input"]>;
  /** Array of GitHub users assigned to the issue */
  assignees_data?: InputMaybe<Scalars["Int"]["input"]>;
  /** GitHub user who closed the issue */
  closed_by_data?: InputMaybe<Scalars["Int"]["input"]>;
  /** Array of labels attached to the issue */
  labels_data?: InputMaybe<Scalars["Int"]["input"]>;
  /** Milestone data if assigned */
  milestone_data?: InputMaybe<Scalars["Int"]["input"]>;
  /** Pull request data if issue is a PR */
  pull_request_data?: InputMaybe<Scalars["Int"]["input"]>;
  /** GitHub user who created the issue */
  user_data?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Github_Issues_Delete_Key_Input = {
  /** GitHub user assigned to the issue */
  assignee_data?: InputMaybe<Scalars["String"]["input"]>;
  /** Array of GitHub users assigned to the issue */
  assignees_data?: InputMaybe<Scalars["String"]["input"]>;
  /** GitHub user who closed the issue */
  closed_by_data?: InputMaybe<Scalars["String"]["input"]>;
  /** Array of labels attached to the issue */
  labels_data?: InputMaybe<Scalars["String"]["input"]>;
  /** Milestone data if assigned */
  milestone_data?: InputMaybe<Scalars["String"]["input"]>;
  /** Pull request data if issue is a PR */
  pull_request_data?: InputMaybe<Scalars["String"]["input"]>;
  /** GitHub user who created the issue */
  user_data?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "github_issues" */
export type Github_Issues_Inc_Input = {
  /** When the issue was closed (unix timestamp) */
  closed_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Number of comments on the issue */
  comments_count?: InputMaybe<Scalars["Int"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: InputMaybe<Scalars["Int"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "github_issues" */
export type Github_Issues_Insert_Input = {
  /** User ID who created/modified the issue (set by trigger) */
  _user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reason for locking the issue */
  active_lock_reason?: InputMaybe<Scalars["String"]["input"]>;
  /** GitHub user assigned to the issue */
  assignee_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Array of GitHub users assigned to the issue */
  assignees_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Author association with repository */
  author_association?: InputMaybe<Scalars["String"]["input"]>;
  /** Issue body/description */
  body?: InputMaybe<Scalars["String"]["input"]>;
  /** When the issue was closed (unix timestamp) */
  closed_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** GitHub user who closed the issue */
  closed_by_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Number of comments on the issue */
  comments_count?: InputMaybe<Scalars["Int"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: InputMaybe<Scalars["bigint"]["input"]>;
  /** GitHub web URL for the issue */
  html_url?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Array of labels attached to the issue */
  labels_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Whether issue is locked */
  locked?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Milestone data if assigned */
  milestone_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** GitHub GraphQL node ID */
  node_id?: InputMaybe<Scalars["String"]["input"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: InputMaybe<Scalars["Int"]["input"]>;
  /** Pull request data if issue is a PR */
  pull_request_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Repository name */
  repository_name?: InputMaybe<Scalars["String"]["input"]>;
  /** Repository owner name */
  repository_owner?: InputMaybe<Scalars["String"]["input"]>;
  /** Issue state: open, closed */
  state?: InputMaybe<Scalars["String"]["input"]>;
  /** Reason for state change */
  state_reason?: InputMaybe<Scalars["String"]["input"]>;
  /** Issue title */
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** GitHub API URL for the issue */
  url?: InputMaybe<Scalars["String"]["input"]>;
  /** GitHub user who created the issue */
  user_data?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate max on columns */
export type Github_Issues_Max_Fields = {
  __typename?: "github_issues_max_fields";
  /** User ID who created/modified the issue (set by trigger) */
  _user_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Reason for locking the issue */
  active_lock_reason?: Maybe<Scalars["String"]["output"]>;
  /** Author association with repository */
  author_association?: Maybe<Scalars["String"]["output"]>;
  /** Issue body/description */
  body?: Maybe<Scalars["String"]["output"]>;
  /** When the issue was closed (unix timestamp) */
  closed_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Number of comments on the issue */
  comments_count?: Maybe<Scalars["Int"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: Maybe<Scalars["bigint"]["output"]>;
  /** GitHub web URL for the issue */
  html_url?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** GitHub GraphQL node ID */
  node_id?: Maybe<Scalars["String"]["output"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: Maybe<Scalars["Int"]["output"]>;
  /** Repository name */
  repository_name?: Maybe<Scalars["String"]["output"]>;
  /** Repository owner name */
  repository_owner?: Maybe<Scalars["String"]["output"]>;
  /** Issue state: open, closed */
  state?: Maybe<Scalars["String"]["output"]>;
  /** Reason for state change */
  state_reason?: Maybe<Scalars["String"]["output"]>;
  /** Issue title */
  title?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** GitHub API URL for the issue */
  url?: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type Github_Issues_Min_Fields = {
  __typename?: "github_issues_min_fields";
  /** User ID who created/modified the issue (set by trigger) */
  _user_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Reason for locking the issue */
  active_lock_reason?: Maybe<Scalars["String"]["output"]>;
  /** Author association with repository */
  author_association?: Maybe<Scalars["String"]["output"]>;
  /** Issue body/description */
  body?: Maybe<Scalars["String"]["output"]>;
  /** When the issue was closed (unix timestamp) */
  closed_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Number of comments on the issue */
  comments_count?: Maybe<Scalars["Int"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: Maybe<Scalars["bigint"]["output"]>;
  /** GitHub web URL for the issue */
  html_url?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** GitHub GraphQL node ID */
  node_id?: Maybe<Scalars["String"]["output"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: Maybe<Scalars["Int"]["output"]>;
  /** Repository name */
  repository_name?: Maybe<Scalars["String"]["output"]>;
  /** Repository owner name */
  repository_owner?: Maybe<Scalars["String"]["output"]>;
  /** Issue state: open, closed */
  state?: Maybe<Scalars["String"]["output"]>;
  /** Reason for state change */
  state_reason?: Maybe<Scalars["String"]["output"]>;
  /** Issue title */
  title?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** GitHub API URL for the issue */
  url?: Maybe<Scalars["String"]["output"]>;
};

/** response of any mutation on the table "github_issues" */
export type Github_Issues_Mutation_Response = {
  __typename?: "github_issues_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Github_Issues>;
};

/** on_conflict condition type for table "github_issues" */
export type Github_Issues_On_Conflict = {
  constraint: Github_Issues_Constraint;
  update_columns?: Array<Github_Issues_Update_Column>;
  where?: InputMaybe<Github_Issues_Bool_Exp>;
};

/** Ordering options when selecting data from "github_issues". */
export type Github_Issues_Order_By = {
  _user_id?: InputMaybe<Order_By>;
  active_lock_reason?: InputMaybe<Order_By>;
  assignee_data?: InputMaybe<Order_By>;
  assignees_data?: InputMaybe<Order_By>;
  author_association?: InputMaybe<Order_By>;
  body?: InputMaybe<Order_By>;
  closed_at?: InputMaybe<Order_By>;
  closed_by_data?: InputMaybe<Order_By>;
  comments_count?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  github_id?: InputMaybe<Order_By>;
  html_url?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  labels_data?: InputMaybe<Order_By>;
  locked?: InputMaybe<Order_By>;
  milestone_data?: InputMaybe<Order_By>;
  node_id?: InputMaybe<Order_By>;
  number?: InputMaybe<Order_By>;
  pull_request_data?: InputMaybe<Order_By>;
  repository_name?: InputMaybe<Order_By>;
  repository_owner?: InputMaybe<Order_By>;
  state?: InputMaybe<Order_By>;
  state_reason?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  url?: InputMaybe<Order_By>;
  user_data?: InputMaybe<Order_By>;
};

/** primary key columns input for table: github_issues */
export type Github_Issues_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Github_Issues_Prepend_Input = {
  /** GitHub user assigned to the issue */
  assignee_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Array of GitHub users assigned to the issue */
  assignees_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** GitHub user who closed the issue */
  closed_by_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Array of labels attached to the issue */
  labels_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Milestone data if assigned */
  milestone_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Pull request data if issue is a PR */
  pull_request_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** GitHub user who created the issue */
  user_data?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "github_issues" */
export enum Github_Issues_Select_Column {
  /** column name */
  UserId = "_user_id",
  /** column name */
  ActiveLockReason = "active_lock_reason",
  /** column name */
  AssigneeData = "assignee_data",
  /** column name */
  AssigneesData = "assignees_data",
  /** column name */
  AuthorAssociation = "author_association",
  /** column name */
  Body = "body",
  /** column name */
  ClosedAt = "closed_at",
  /** column name */
  ClosedByData = "closed_by_data",
  /** column name */
  CommentsCount = "comments_count",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  GithubId = "github_id",
  /** column name */
  HtmlUrl = "html_url",
  /** column name */
  Id = "id",
  /** column name */
  LabelsData = "labels_data",
  /** column name */
  Locked = "locked",
  /** column name */
  MilestoneData = "milestone_data",
  /** column name */
  NodeId = "node_id",
  /** column name */
  Number = "number",
  /** column name */
  PullRequestData = "pull_request_data",
  /** column name */
  RepositoryName = "repository_name",
  /** column name */
  RepositoryOwner = "repository_owner",
  /** column name */
  State = "state",
  /** column name */
  StateReason = "state_reason",
  /** column name */
  Title = "title",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  Url = "url",
  /** column name */
  UserData = "user_data",
}

/** input type for updating data in table "github_issues" */
export type Github_Issues_Set_Input = {
  /** User ID who created/modified the issue (set by trigger) */
  _user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reason for locking the issue */
  active_lock_reason?: InputMaybe<Scalars["String"]["input"]>;
  /** GitHub user assigned to the issue */
  assignee_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Array of GitHub users assigned to the issue */
  assignees_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Author association with repository */
  author_association?: InputMaybe<Scalars["String"]["input"]>;
  /** Issue body/description */
  body?: InputMaybe<Scalars["String"]["input"]>;
  /** When the issue was closed (unix timestamp) */
  closed_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** GitHub user who closed the issue */
  closed_by_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Number of comments on the issue */
  comments_count?: InputMaybe<Scalars["Int"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: InputMaybe<Scalars["bigint"]["input"]>;
  /** GitHub web URL for the issue */
  html_url?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Array of labels attached to the issue */
  labels_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Whether issue is locked */
  locked?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Milestone data if assigned */
  milestone_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** GitHub GraphQL node ID */
  node_id?: InputMaybe<Scalars["String"]["input"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: InputMaybe<Scalars["Int"]["input"]>;
  /** Pull request data if issue is a PR */
  pull_request_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Repository name */
  repository_name?: InputMaybe<Scalars["String"]["input"]>;
  /** Repository owner name */
  repository_owner?: InputMaybe<Scalars["String"]["input"]>;
  /** Issue state: open, closed */
  state?: InputMaybe<Scalars["String"]["input"]>;
  /** Reason for state change */
  state_reason?: InputMaybe<Scalars["String"]["input"]>;
  /** Issue title */
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** GitHub API URL for the issue */
  url?: InputMaybe<Scalars["String"]["input"]>;
  /** GitHub user who created the issue */
  user_data?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate stddev on columns */
export type Github_Issues_Stddev_Fields = {
  __typename?: "github_issues_stddev_fields";
  /** When the issue was closed (unix timestamp) */
  closed_at?: Maybe<Scalars["Float"]["output"]>;
  /** Number of comments on the issue */
  comments_count?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: Maybe<Scalars["Float"]["output"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Github_Issues_Stddev_Pop_Fields = {
  __typename?: "github_issues_stddev_pop_fields";
  /** When the issue was closed (unix timestamp) */
  closed_at?: Maybe<Scalars["Float"]["output"]>;
  /** Number of comments on the issue */
  comments_count?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: Maybe<Scalars["Float"]["output"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Github_Issues_Stddev_Samp_Fields = {
  __typename?: "github_issues_stddev_samp_fields";
  /** When the issue was closed (unix timestamp) */
  closed_at?: Maybe<Scalars["Float"]["output"]>;
  /** Number of comments on the issue */
  comments_count?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: Maybe<Scalars["Float"]["output"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "github_issues" */
export type Github_Issues_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Github_Issues_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Github_Issues_Stream_Cursor_Value_Input = {
  /** User ID who created/modified the issue (set by trigger) */
  _user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reason for locking the issue */
  active_lock_reason?: InputMaybe<Scalars["String"]["input"]>;
  /** GitHub user assigned to the issue */
  assignee_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Array of GitHub users assigned to the issue */
  assignees_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Author association with repository */
  author_association?: InputMaybe<Scalars["String"]["input"]>;
  /** Issue body/description */
  body?: InputMaybe<Scalars["String"]["input"]>;
  /** When the issue was closed (unix timestamp) */
  closed_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** GitHub user who closed the issue */
  closed_by_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Number of comments on the issue */
  comments_count?: InputMaybe<Scalars["Int"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: InputMaybe<Scalars["bigint"]["input"]>;
  /** GitHub web URL for the issue */
  html_url?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Array of labels attached to the issue */
  labels_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Whether issue is locked */
  locked?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Milestone data if assigned */
  milestone_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** GitHub GraphQL node ID */
  node_id?: InputMaybe<Scalars["String"]["input"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: InputMaybe<Scalars["Int"]["input"]>;
  /** Pull request data if issue is a PR */
  pull_request_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Repository name */
  repository_name?: InputMaybe<Scalars["String"]["input"]>;
  /** Repository owner name */
  repository_owner?: InputMaybe<Scalars["String"]["input"]>;
  /** Issue state: open, closed */
  state?: InputMaybe<Scalars["String"]["input"]>;
  /** Reason for state change */
  state_reason?: InputMaybe<Scalars["String"]["input"]>;
  /** Issue title */
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** GitHub API URL for the issue */
  url?: InputMaybe<Scalars["String"]["input"]>;
  /** GitHub user who created the issue */
  user_data?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate sum on columns */
export type Github_Issues_Sum_Fields = {
  __typename?: "github_issues_sum_fields";
  /** When the issue was closed (unix timestamp) */
  closed_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Number of comments on the issue */
  comments_count?: Maybe<Scalars["Int"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: Maybe<Scalars["bigint"]["output"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: Maybe<Scalars["Int"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** update columns of table "github_issues" */
export enum Github_Issues_Update_Column {
  /** column name */
  UserId = "_user_id",
  /** column name */
  ActiveLockReason = "active_lock_reason",
  /** column name */
  AssigneeData = "assignee_data",
  /** column name */
  AssigneesData = "assignees_data",
  /** column name */
  AuthorAssociation = "author_association",
  /** column name */
  Body = "body",
  /** column name */
  ClosedAt = "closed_at",
  /** column name */
  ClosedByData = "closed_by_data",
  /** column name */
  CommentsCount = "comments_count",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  GithubId = "github_id",
  /** column name */
  HtmlUrl = "html_url",
  /** column name */
  Id = "id",
  /** column name */
  LabelsData = "labels_data",
  /** column name */
  Locked = "locked",
  /** column name */
  MilestoneData = "milestone_data",
  /** column name */
  NodeId = "node_id",
  /** column name */
  Number = "number",
  /** column name */
  PullRequestData = "pull_request_data",
  /** column name */
  RepositoryName = "repository_name",
  /** column name */
  RepositoryOwner = "repository_owner",
  /** column name */
  State = "state",
  /** column name */
  StateReason = "state_reason",
  /** column name */
  Title = "title",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  Url = "url",
  /** column name */
  UserData = "user_data",
}

export type Github_Issues_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Github_Issues_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Github_Issues_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Github_Issues_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Github_Issues_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Github_Issues_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Github_Issues_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Github_Issues_Set_Input>;
  /** filter the rows which have to be updated */
  where: Github_Issues_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Github_Issues_Var_Pop_Fields = {
  __typename?: "github_issues_var_pop_fields";
  /** When the issue was closed (unix timestamp) */
  closed_at?: Maybe<Scalars["Float"]["output"]>;
  /** Number of comments on the issue */
  comments_count?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: Maybe<Scalars["Float"]["output"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Github_Issues_Var_Samp_Fields = {
  __typename?: "github_issues_var_samp_fields";
  /** When the issue was closed (unix timestamp) */
  closed_at?: Maybe<Scalars["Float"]["output"]>;
  /** Number of comments on the issue */
  comments_count?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: Maybe<Scalars["Float"]["output"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Github_Issues_Variance_Fields = {
  __typename?: "github_issues_variance_fields";
  /** When the issue was closed (unix timestamp) */
  closed_at?: Maybe<Scalars["Float"]["output"]>;
  /** Number of comments on the issue */
  comments_count?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** GitHub issue ID from API (nullable for user-created issues) */
  github_id?: Maybe<Scalars["Float"]["output"]>;
  /** Issue number in repository (nullable for user-created issues) */
  number?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "invites" */
export type Invites = {
  __typename?: "invites";
  /** Unique invite code */
  code: Scalars["String"]["output"];
  created_at: Scalars["bigint"]["output"];
  id: Scalars["uuid"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** User who created the invite */
  user_id: Scalars["uuid"]["output"];
};

/** aggregated selection of "invites" */
export type Invites_Aggregate = {
  __typename?: "invites_aggregate";
  aggregate?: Maybe<Invites_Aggregate_Fields>;
  nodes: Array<Invites>;
};

/** aggregate fields of "invites" */
export type Invites_Aggregate_Fields = {
  __typename?: "invites_aggregate_fields";
  avg?: Maybe<Invites_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Invites_Max_Fields>;
  min?: Maybe<Invites_Min_Fields>;
  stddev?: Maybe<Invites_Stddev_Fields>;
  stddev_pop?: Maybe<Invites_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Invites_Stddev_Samp_Fields>;
  sum?: Maybe<Invites_Sum_Fields>;
  var_pop?: Maybe<Invites_Var_Pop_Fields>;
  var_samp?: Maybe<Invites_Var_Samp_Fields>;
  variance?: Maybe<Invites_Variance_Fields>;
};

/** aggregate fields of "invites" */
export type Invites_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Invites_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Invites_Avg_Fields = {
  __typename?: "invites_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "invites". All fields are combined with a logical 'AND'. */
export type Invites_Bool_Exp = {
  _and?: InputMaybe<Array<Invites_Bool_Exp>>;
  _not?: InputMaybe<Invites_Bool_Exp>;
  _or?: InputMaybe<Array<Invites_Bool_Exp>>;
  code?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "invites" */
export enum Invites_Constraint {
  /** unique or primary key constraint on columns "code" */
  InvitesCodeKey = "invites_code_key",
  /** unique or primary key constraint on columns "id" */
  InvitesPkey = "invites_pkey",
}

/** input type for incrementing numeric columns in table "invites" */
export type Invites_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "invites" */
export type Invites_Insert_Input = {
  /** Unique invite code */
  code?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User who created the invite */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Invites_Max_Fields = {
  __typename?: "invites_max_fields";
  /** Unique invite code */
  code?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User who created the invite */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregate min on columns */
export type Invites_Min_Fields = {
  __typename?: "invites_min_fields";
  /** Unique invite code */
  code?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User who created the invite */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** response of any mutation on the table "invites" */
export type Invites_Mutation_Response = {
  __typename?: "invites_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Invites>;
};

/** on_conflict condition type for table "invites" */
export type Invites_On_Conflict = {
  constraint: Invites_Constraint;
  update_columns?: Array<Invites_Update_Column>;
  where?: InputMaybe<Invites_Bool_Exp>;
};

/** Ordering options when selecting data from "invites". */
export type Invites_Order_By = {
  code?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: invites */
export type Invites_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "invites" */
export enum Invites_Select_Column {
  /** column name */
  Code = "code",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "invites" */
export type Invites_Set_Input = {
  /** Unique invite code */
  code?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User who created the invite */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Invites_Stddev_Fields = {
  __typename?: "invites_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Invites_Stddev_Pop_Fields = {
  __typename?: "invites_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Invites_Stddev_Samp_Fields = {
  __typename?: "invites_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "invites" */
export type Invites_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Invites_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Invites_Stream_Cursor_Value_Input = {
  /** Unique invite code */
  code?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User who created the invite */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Invites_Sum_Fields = {
  __typename?: "invites_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** update columns of table "invites" */
export enum Invites_Update_Column {
  /** column name */
  Code = "code",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Invites_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Invites_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Invites_Set_Input>;
  /** filter the rows which have to be updated */
  where: Invites_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Invites_Var_Pop_Fields = {
  __typename?: "invites_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Invites_Var_Samp_Fields = {
  __typename?: "invites_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Invites_Variance_Fields = {
  __typename?: "invites_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars["jsonb"]["input"]>;
  _eq?: InputMaybe<Scalars["jsonb"]["input"]>;
  _gt?: InputMaybe<Scalars["jsonb"]["input"]>;
  _gte?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars["String"]["input"]>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars["String"]["input"]>>;
  _in?: InputMaybe<Array<Scalars["jsonb"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["jsonb"]["input"]>;
  _lte?: InputMaybe<Scalars["jsonb"]["input"]>;
  _neq?: InputMaybe<Scalars["jsonb"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["jsonb"]["input"]>>;
};

/** columns and relationships of "logs.diffs" */
export type Logs_Diffs = {
  __typename?: "logs_diffs";
  /** Source column name */
  _column: Scalars["String"]["output"];
  /** Source record identifier */
  _id: Scalars["String"]["output"];
  /** Source schema name */
  _schema: Scalars["String"]["output"];
  /** Source table name */
  _table: Scalars["String"]["output"];
  created_at: Scalars["bigint"]["output"];
  id: Scalars["uuid"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** User who made the change */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregated selection of "logs.diffs" */
export type Logs_Diffs_Aggregate = {
  __typename?: "logs_diffs_aggregate";
  aggregate?: Maybe<Logs_Diffs_Aggregate_Fields>;
  nodes: Array<Logs_Diffs>;
};

/** aggregate fields of "logs.diffs" */
export type Logs_Diffs_Aggregate_Fields = {
  __typename?: "logs_diffs_aggregate_fields";
  avg?: Maybe<Logs_Diffs_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Logs_Diffs_Max_Fields>;
  min?: Maybe<Logs_Diffs_Min_Fields>;
  stddev?: Maybe<Logs_Diffs_Stddev_Fields>;
  stddev_pop?: Maybe<Logs_Diffs_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Logs_Diffs_Stddev_Samp_Fields>;
  sum?: Maybe<Logs_Diffs_Sum_Fields>;
  var_pop?: Maybe<Logs_Diffs_Var_Pop_Fields>;
  var_samp?: Maybe<Logs_Diffs_Var_Samp_Fields>;
  variance?: Maybe<Logs_Diffs_Variance_Fields>;
};

/** aggregate fields of "logs.diffs" */
export type Logs_Diffs_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Logs_Diffs_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Logs_Diffs_Avg_Fields = {
  __typename?: "logs_diffs_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "logs.diffs". All fields are combined with a logical 'AND'. */
export type Logs_Diffs_Bool_Exp = {
  _and?: InputMaybe<Array<Logs_Diffs_Bool_Exp>>;
  _column?: InputMaybe<String_Comparison_Exp>;
  _id?: InputMaybe<String_Comparison_Exp>;
  _not?: InputMaybe<Logs_Diffs_Bool_Exp>;
  _or?: InputMaybe<Array<Logs_Diffs_Bool_Exp>>;
  _schema?: InputMaybe<String_Comparison_Exp>;
  _table?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "logs.diffs" */
export enum Logs_Diffs_Constraint {
  /** unique or primary key constraint on columns "id" */
  DiffsPkey = "diffs_pkey",
}

/** input type for incrementing numeric columns in table "logs.diffs" */
export type Logs_Diffs_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "logs.diffs" */
export type Logs_Diffs_Insert_Input = {
  /** Source column name */
  _column?: InputMaybe<Scalars["String"]["input"]>;
  /** Source record identifier */
  _id?: InputMaybe<Scalars["String"]["input"]>;
  /** Source schema name */
  _schema?: InputMaybe<Scalars["String"]["input"]>;
  /** Source table name */
  _table?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User who made the change */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Logs_Diffs_Max_Fields = {
  __typename?: "logs_diffs_max_fields";
  /** Source column name */
  _column?: Maybe<Scalars["String"]["output"]>;
  /** Source record identifier */
  _id?: Maybe<Scalars["String"]["output"]>;
  /** Source schema name */
  _schema?: Maybe<Scalars["String"]["output"]>;
  /** Source table name */
  _table?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User who made the change */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregate min on columns */
export type Logs_Diffs_Min_Fields = {
  __typename?: "logs_diffs_min_fields";
  /** Source column name */
  _column?: Maybe<Scalars["String"]["output"]>;
  /** Source record identifier */
  _id?: Maybe<Scalars["String"]["output"]>;
  /** Source schema name */
  _schema?: Maybe<Scalars["String"]["output"]>;
  /** Source table name */
  _table?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User who made the change */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** response of any mutation on the table "logs.diffs" */
export type Logs_Diffs_Mutation_Response = {
  __typename?: "logs_diffs_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Logs_Diffs>;
};

/** on_conflict condition type for table "logs.diffs" */
export type Logs_Diffs_On_Conflict = {
  constraint: Logs_Diffs_Constraint;
  update_columns?: Array<Logs_Diffs_Update_Column>;
  where?: InputMaybe<Logs_Diffs_Bool_Exp>;
};

/** Ordering options when selecting data from "logs.diffs". */
export type Logs_Diffs_Order_By = {
  _column?: InputMaybe<Order_By>;
  _id?: InputMaybe<Order_By>;
  _schema?: InputMaybe<Order_By>;
  _table?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: logs.diffs */
export type Logs_Diffs_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "logs.diffs" */
export enum Logs_Diffs_Select_Column {
  /** column name */
  Column = "_column",
  /** column name */
  Id = "_id",
  /** column name */
  Schema = "_schema",
  /** column name */
  Table = "_table",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "logs.diffs" */
export type Logs_Diffs_Set_Input = {
  /** Source column name */
  _column?: InputMaybe<Scalars["String"]["input"]>;
  /** Source record identifier */
  _id?: InputMaybe<Scalars["String"]["input"]>;
  /** Source schema name */
  _schema?: InputMaybe<Scalars["String"]["input"]>;
  /** Source table name */
  _table?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User who made the change */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Logs_Diffs_Stddev_Fields = {
  __typename?: "logs_diffs_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Logs_Diffs_Stddev_Pop_Fields = {
  __typename?: "logs_diffs_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Logs_Diffs_Stddev_Samp_Fields = {
  __typename?: "logs_diffs_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "logs_diffs" */
export type Logs_Diffs_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Logs_Diffs_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Logs_Diffs_Stream_Cursor_Value_Input = {
  /** Source column name */
  _column?: InputMaybe<Scalars["String"]["input"]>;
  /** Source record identifier */
  _id?: InputMaybe<Scalars["String"]["input"]>;
  /** Source schema name */
  _schema?: InputMaybe<Scalars["String"]["input"]>;
  /** Source table name */
  _table?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User who made the change */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Logs_Diffs_Sum_Fields = {
  __typename?: "logs_diffs_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** update columns of table "logs.diffs" */
export enum Logs_Diffs_Update_Column {
  /** column name */
  Column = "_column",
  /** column name */
  Id = "_id",
  /** column name */
  Schema = "_schema",
  /** column name */
  Table = "_table",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Logs_Diffs_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Logs_Diffs_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Logs_Diffs_Set_Input>;
  /** filter the rows which have to be updated */
  where: Logs_Diffs_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Logs_Diffs_Var_Pop_Fields = {
  __typename?: "logs_diffs_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Logs_Diffs_Var_Samp_Fields = {
  __typename?: "logs_diffs_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Logs_Diffs_Variance_Fields = {
  __typename?: "logs_diffs_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: "mutation_root";
  /** delete single row from the table: "storage.buckets" */
  deleteBucket?: Maybe<Buckets>;
  /** delete data from the table: "storage.buckets" */
  deleteBuckets?: Maybe<Buckets_Mutation_Response>;
  /** delete single row from the table: "storage.files" */
  deleteFile?: Maybe<Files>;
  /** delete single row from the table: "storage.files_blob" */
  deleteFileBlob?: Maybe<FilesBlob>;
  /** delete data from the table: "storage.files" */
  deleteFiles?: Maybe<Files_Mutation_Response>;
  /** delete data from the table: "storage.files_blob" */
  deleteFilesBlobs?: Maybe<FilesBlob_Mutation_Response>;
  /** delete single row from the table: "storage.virus" */
  deleteVirus?: Maybe<Virus>;
  /** delete data from the table: "storage.virus" */
  deleteViruses?: Maybe<Virus_Mutation_Response>;
  /** delete data from the table: "accounts" */
  delete_accounts?: Maybe<Accounts_Mutation_Response>;
  /** delete single row from the table: "accounts" */
  delete_accounts_by_pk?: Maybe<Accounts>;
  /** delete data from the table: "achievements" */
  delete_achievements?: Maybe<Achievements_Mutation_Response>;
  /** delete single row from the table: "achievements" */
  delete_achievements_by_pk?: Maybe<Achievements>;
  /** delete data from the table: "ai_sessions" */
  delete_ai_sessions?: Maybe<Ai_Sessions_Mutation_Response>;
  /** delete single row from the table: "ai_sessions" */
  delete_ai_sessions_by_pk?: Maybe<Ai_Sessions>;
  /** delete data from the table: "auth_jwt" */
  delete_auth_jwt?: Maybe<Auth_Jwt_Mutation_Response>;
  /** delete single row from the table: "auth_jwt" */
  delete_auth_jwt_by_pk?: Maybe<Auth_Jwt>;
  /** delete data from the table: "daily_tasks" */
  delete_daily_tasks?: Maybe<Daily_Tasks_Mutation_Response>;
  /** delete single row from the table: "daily_tasks" */
  delete_daily_tasks_by_pk?: Maybe<Daily_Tasks>;
  /** delete data from the table: "debug" */
  delete_debug?: Maybe<Debug_Mutation_Response>;
  /** delete single row from the table: "debug" */
  delete_debug_by_pk?: Maybe<Debug>;
  /** delete data from the table: "error_log" */
  delete_error_log?: Maybe<Error_Log_Mutation_Response>;
  /** delete single row from the table: "error_log" */
  delete_error_log_by_pk?: Maybe<Error_Log>;
  /** delete data from the table: "github_issues" */
  delete_github_issues?: Maybe<Github_Issues_Mutation_Response>;
  /** delete single row from the table: "github_issues" */
  delete_github_issues_by_pk?: Maybe<Github_Issues>;
  /** delete data from the table: "invites" */
  delete_invites?: Maybe<Invites_Mutation_Response>;
  /** delete single row from the table: "invites" */
  delete_invites_by_pk?: Maybe<Invites>;
  /** delete data from the table: "logs.diffs" */
  delete_logs_diffs?: Maybe<Logs_Diffs_Mutation_Response>;
  /** delete single row from the table: "logs.diffs" */
  delete_logs_diffs_by_pk?: Maybe<Logs_Diffs>;
  /** delete data from the table: "notification_messages" */
  delete_notification_messages?: Maybe<Notification_Messages_Mutation_Response>;
  /** delete single row from the table: "notification_messages" */
  delete_notification_messages_by_pk?: Maybe<Notification_Messages>;
  /** delete data from the table: "notification_permissions" */
  delete_notification_permissions?: Maybe<Notification_Permissions_Mutation_Response>;
  /** delete single row from the table: "notification_permissions" */
  delete_notification_permissions_by_pk?: Maybe<Notification_Permissions>;
  /** delete data from the table: "notifications" */
  delete_notifications?: Maybe<Notifications_Mutation_Response>;
  /** delete single row from the table: "notifications" */
  delete_notifications_by_pk?: Maybe<Notifications>;
  /** delete data from the table: "payments.methods" */
  delete_payments_methods?: Maybe<Payments_Methods_Mutation_Response>;
  /** delete single row from the table: "payments.methods" */
  delete_payments_methods_by_pk?: Maybe<Payments_Methods>;
  /** delete data from the table: "payments.operations" */
  delete_payments_operations?: Maybe<Payments_Operations_Mutation_Response>;
  /** delete single row from the table: "payments.operations" */
  delete_payments_operations_by_pk?: Maybe<Payments_Operations>;
  /** delete data from the table: "payments.plans" */
  delete_payments_plans?: Maybe<Payments_Plans_Mutation_Response>;
  /** delete single row from the table: "payments.plans" */
  delete_payments_plans_by_pk?: Maybe<Payments_Plans>;
  /** delete data from the table: "payments.providers" */
  delete_payments_providers?: Maybe<Payments_Providers_Mutation_Response>;
  /** delete single row from the table: "payments.providers" */
  delete_payments_providers_by_pk?: Maybe<Payments_Providers>;
  /** delete data from the table: "payments.subscriptions" */
  delete_payments_subscriptions?: Maybe<Payments_Subscriptions_Mutation_Response>;
  /** delete single row from the table: "payments.subscriptions" */
  delete_payments_subscriptions_by_pk?: Maybe<Payments_Subscriptions>;
  /** delete data from the table: "payments.user_payment_provider_mappings" */
  delete_payments_user_payment_provider_mappings?: Maybe<Payments_User_Payment_Provider_Mappings_Mutation_Response>;
  /** delete single row from the table: "payments.user_payment_provider_mappings" */
  delete_payments_user_payment_provider_mappings_by_pk?: Maybe<Payments_User_Payment_Provider_Mappings>;
  /** delete data from the table: "progress_metrics" */
  delete_progress_metrics?: Maybe<Progress_Metrics_Mutation_Response>;
  /** delete single row from the table: "progress_metrics" */
  delete_progress_metrics_by_pk?: Maybe<Progress_Metrics>;
  /** delete data from the table: "review_history" */
  delete_review_history?: Maybe<Review_History_Mutation_Response>;
  /** delete single row from the table: "review_history" */
  delete_review_history_by_pk?: Maybe<Review_History>;
  /** delete data from the table: "stage_progress" */
  delete_stage_progress?: Maybe<Stage_Progress_Mutation_Response>;
  /** delete single row from the table: "stage_progress" */
  delete_stage_progress_by_pk?: Maybe<Stage_Progress>;
  /** delete data from the table: "stage_requirements" */
  delete_stage_requirements?: Maybe<Stage_Requirements_Mutation_Response>;
  /** delete single row from the table: "stage_requirements" */
  delete_stage_requirements_by_pk?: Maybe<Stage_Requirements>;
  /** delete data from the table: "stage_tests" */
  delete_stage_tests?: Maybe<Stage_Tests_Mutation_Response>;
  /** delete single row from the table: "stage_tests" */
  delete_stage_tests_by_pk?: Maybe<Stage_Tests>;
  /** delete data from the table: "streaks" */
  delete_streaks?: Maybe<Streaks_Mutation_Response>;
  /** delete single row from the table: "streaks" */
  delete_streaks_by_pk?: Maybe<Streaks>;
  /** delete data from the table: "study_stages" */
  delete_study_stages?: Maybe<Study_Stages_Mutation_Response>;
  /** delete single row from the table: "study_stages" */
  delete_study_stages_by_pk?: Maybe<Study_Stages>;
  /** delete data from the table: "users" */
  delete_users?: Maybe<Users_Mutation_Response>;
  /** delete single row from the table: "users" */
  delete_users_by_pk?: Maybe<Users>;
  /** delete data from the table: "verification_codes" */
  delete_verification_codes?: Maybe<Verification_Codes_Mutation_Response>;
  /** delete single row from the table: "verification_codes" */
  delete_verification_codes_by_pk?: Maybe<Verification_Codes>;
  /** delete data from the table: "vocabulary_cards" */
  delete_vocabulary_cards?: Maybe<Vocabulary_Cards_Mutation_Response>;
  /** delete single row from the table: "vocabulary_cards" */
  delete_vocabulary_cards_by_pk?: Maybe<Vocabulary_Cards>;
  /** delete data from the table: "weekly_structure" */
  delete_weekly_structure?: Maybe<Weekly_Structure_Mutation_Response>;
  /** delete single row from the table: "weekly_structure" */
  delete_weekly_structure_by_pk?: Maybe<Weekly_Structure>;
  /** insert a single row into the table: "storage.buckets" */
  insertBucket?: Maybe<Buckets>;
  /** insert data into the table: "storage.buckets" */
  insertBuckets?: Maybe<Buckets_Mutation_Response>;
  /** insert a single row into the table: "storage.files" */
  insertFile?: Maybe<Files>;
  /** insert a single row into the table: "storage.files_blob" */
  insertFileBlob?: Maybe<FilesBlob>;
  /** insert data into the table: "storage.files" */
  insertFiles?: Maybe<Files_Mutation_Response>;
  /** insert data into the table: "storage.files_blob" */
  insertFilesBlobs?: Maybe<FilesBlob_Mutation_Response>;
  /** insert a single row into the table: "storage.virus" */
  insertVirus?: Maybe<Virus>;
  /** insert data into the table: "storage.virus" */
  insertViruses?: Maybe<Virus_Mutation_Response>;
  /** insert data into the table: "accounts" */
  insert_accounts?: Maybe<Accounts_Mutation_Response>;
  /** insert a single row into the table: "accounts" */
  insert_accounts_one?: Maybe<Accounts>;
  /** insert data into the table: "achievements" */
  insert_achievements?: Maybe<Achievements_Mutation_Response>;
  /** insert a single row into the table: "achievements" */
  insert_achievements_one?: Maybe<Achievements>;
  /** insert data into the table: "ai_sessions" */
  insert_ai_sessions?: Maybe<Ai_Sessions_Mutation_Response>;
  /** insert a single row into the table: "ai_sessions" */
  insert_ai_sessions_one?: Maybe<Ai_Sessions>;
  /** insert data into the table: "auth_jwt" */
  insert_auth_jwt?: Maybe<Auth_Jwt_Mutation_Response>;
  /** insert a single row into the table: "auth_jwt" */
  insert_auth_jwt_one?: Maybe<Auth_Jwt>;
  /** insert data into the table: "daily_tasks" */
  insert_daily_tasks?: Maybe<Daily_Tasks_Mutation_Response>;
  /** insert a single row into the table: "daily_tasks" */
  insert_daily_tasks_one?: Maybe<Daily_Tasks>;
  /** insert data into the table: "debug" */
  insert_debug?: Maybe<Debug_Mutation_Response>;
  /** insert a single row into the table: "debug" */
  insert_debug_one?: Maybe<Debug>;
  /** insert data into the table: "error_log" */
  insert_error_log?: Maybe<Error_Log_Mutation_Response>;
  /** insert a single row into the table: "error_log" */
  insert_error_log_one?: Maybe<Error_Log>;
  /** insert data into the table: "github_issues" */
  insert_github_issues?: Maybe<Github_Issues_Mutation_Response>;
  /** insert a single row into the table: "github_issues" */
  insert_github_issues_one?: Maybe<Github_Issues>;
  /** insert data into the table: "invites" */
  insert_invites?: Maybe<Invites_Mutation_Response>;
  /** insert a single row into the table: "invites" */
  insert_invites_one?: Maybe<Invites>;
  /** insert data into the table: "logs.diffs" */
  insert_logs_diffs?: Maybe<Logs_Diffs_Mutation_Response>;
  /** insert a single row into the table: "logs.diffs" */
  insert_logs_diffs_one?: Maybe<Logs_Diffs>;
  /** insert data into the table: "notification_messages" */
  insert_notification_messages?: Maybe<Notification_Messages_Mutation_Response>;
  /** insert a single row into the table: "notification_messages" */
  insert_notification_messages_one?: Maybe<Notification_Messages>;
  /** insert data into the table: "notification_permissions" */
  insert_notification_permissions?: Maybe<Notification_Permissions_Mutation_Response>;
  /** insert a single row into the table: "notification_permissions" */
  insert_notification_permissions_one?: Maybe<Notification_Permissions>;
  /** insert data into the table: "notifications" */
  insert_notifications?: Maybe<Notifications_Mutation_Response>;
  /** insert a single row into the table: "notifications" */
  insert_notifications_one?: Maybe<Notifications>;
  /** insert data into the table: "payments.methods" */
  insert_payments_methods?: Maybe<Payments_Methods_Mutation_Response>;
  /** insert a single row into the table: "payments.methods" */
  insert_payments_methods_one?: Maybe<Payments_Methods>;
  /** insert data into the table: "payments.operations" */
  insert_payments_operations?: Maybe<Payments_Operations_Mutation_Response>;
  /** insert a single row into the table: "payments.operations" */
  insert_payments_operations_one?: Maybe<Payments_Operations>;
  /** insert data into the table: "payments.plans" */
  insert_payments_plans?: Maybe<Payments_Plans_Mutation_Response>;
  /** insert a single row into the table: "payments.plans" */
  insert_payments_plans_one?: Maybe<Payments_Plans>;
  /** insert data into the table: "payments.providers" */
  insert_payments_providers?: Maybe<Payments_Providers_Mutation_Response>;
  /** insert a single row into the table: "payments.providers" */
  insert_payments_providers_one?: Maybe<Payments_Providers>;
  /** insert data into the table: "payments.subscriptions" */
  insert_payments_subscriptions?: Maybe<Payments_Subscriptions_Mutation_Response>;
  /** insert a single row into the table: "payments.subscriptions" */
  insert_payments_subscriptions_one?: Maybe<Payments_Subscriptions>;
  /** insert data into the table: "payments.user_payment_provider_mappings" */
  insert_payments_user_payment_provider_mappings?: Maybe<Payments_User_Payment_Provider_Mappings_Mutation_Response>;
  /** insert a single row into the table: "payments.user_payment_provider_mappings" */
  insert_payments_user_payment_provider_mappings_one?: Maybe<Payments_User_Payment_Provider_Mappings>;
  /** insert data into the table: "progress_metrics" */
  insert_progress_metrics?: Maybe<Progress_Metrics_Mutation_Response>;
  /** insert a single row into the table: "progress_metrics" */
  insert_progress_metrics_one?: Maybe<Progress_Metrics>;
  /** insert data into the table: "review_history" */
  insert_review_history?: Maybe<Review_History_Mutation_Response>;
  /** insert a single row into the table: "review_history" */
  insert_review_history_one?: Maybe<Review_History>;
  /** insert data into the table: "stage_progress" */
  insert_stage_progress?: Maybe<Stage_Progress_Mutation_Response>;
  /** insert a single row into the table: "stage_progress" */
  insert_stage_progress_one?: Maybe<Stage_Progress>;
  /** insert data into the table: "stage_requirements" */
  insert_stage_requirements?: Maybe<Stage_Requirements_Mutation_Response>;
  /** insert a single row into the table: "stage_requirements" */
  insert_stage_requirements_one?: Maybe<Stage_Requirements>;
  /** insert data into the table: "stage_tests" */
  insert_stage_tests?: Maybe<Stage_Tests_Mutation_Response>;
  /** insert a single row into the table: "stage_tests" */
  insert_stage_tests_one?: Maybe<Stage_Tests>;
  /** insert data into the table: "streaks" */
  insert_streaks?: Maybe<Streaks_Mutation_Response>;
  /** insert a single row into the table: "streaks" */
  insert_streaks_one?: Maybe<Streaks>;
  /** insert data into the table: "study_stages" */
  insert_study_stages?: Maybe<Study_Stages_Mutation_Response>;
  /** insert a single row into the table: "study_stages" */
  insert_study_stages_one?: Maybe<Study_Stages>;
  /** insert data into the table: "users" */
  insert_users?: Maybe<Users_Mutation_Response>;
  /** insert a single row into the table: "users" */
  insert_users_one?: Maybe<Users>;
  /** insert data into the table: "verification_codes" */
  insert_verification_codes?: Maybe<Verification_Codes_Mutation_Response>;
  /** insert a single row into the table: "verification_codes" */
  insert_verification_codes_one?: Maybe<Verification_Codes>;
  /** insert data into the table: "vocabulary_cards" */
  insert_vocabulary_cards?: Maybe<Vocabulary_Cards_Mutation_Response>;
  /** insert a single row into the table: "vocabulary_cards" */
  insert_vocabulary_cards_one?: Maybe<Vocabulary_Cards>;
  /** insert data into the table: "weekly_structure" */
  insert_weekly_structure?: Maybe<Weekly_Structure_Mutation_Response>;
  /** insert a single row into the table: "weekly_structure" */
  insert_weekly_structure_one?: Maybe<Weekly_Structure>;
  /** update single row of the table: "storage.buckets" */
  updateBucket?: Maybe<Buckets>;
  /** update data of the table: "storage.buckets" */
  updateBuckets?: Maybe<Buckets_Mutation_Response>;
  /** update single row of the table: "storage.files" */
  updateFile?: Maybe<Files>;
  /** update data of the table: "storage.files" */
  updateFiles?: Maybe<Files_Mutation_Response>;
  /** update single row of the table: "storage.virus" */
  updateVirus?: Maybe<Virus>;
  /** update data of the table: "storage.virus" */
  updateViruses?: Maybe<Virus_Mutation_Response>;
  /** update data of the table: "accounts" */
  update_accounts?: Maybe<Accounts_Mutation_Response>;
  /** update single row of the table: "accounts" */
  update_accounts_by_pk?: Maybe<Accounts>;
  /** update multiples rows of table: "accounts" */
  update_accounts_many?: Maybe<Array<Maybe<Accounts_Mutation_Response>>>;
  /** update data of the table: "achievements" */
  update_achievements?: Maybe<Achievements_Mutation_Response>;
  /** update single row of the table: "achievements" */
  update_achievements_by_pk?: Maybe<Achievements>;
  /** update multiples rows of table: "achievements" */
  update_achievements_many?: Maybe<
    Array<Maybe<Achievements_Mutation_Response>>
  >;
  /** update data of the table: "ai_sessions" */
  update_ai_sessions?: Maybe<Ai_Sessions_Mutation_Response>;
  /** update single row of the table: "ai_sessions" */
  update_ai_sessions_by_pk?: Maybe<Ai_Sessions>;
  /** update multiples rows of table: "ai_sessions" */
  update_ai_sessions_many?: Maybe<Array<Maybe<Ai_Sessions_Mutation_Response>>>;
  /** update data of the table: "auth_jwt" */
  update_auth_jwt?: Maybe<Auth_Jwt_Mutation_Response>;
  /** update single row of the table: "auth_jwt" */
  update_auth_jwt_by_pk?: Maybe<Auth_Jwt>;
  /** update multiples rows of table: "auth_jwt" */
  update_auth_jwt_many?: Maybe<Array<Maybe<Auth_Jwt_Mutation_Response>>>;
  /** update multiples rows of table: "storage.buckets" */
  update_buckets_many?: Maybe<Array<Maybe<Buckets_Mutation_Response>>>;
  /** update data of the table: "daily_tasks" */
  update_daily_tasks?: Maybe<Daily_Tasks_Mutation_Response>;
  /** update single row of the table: "daily_tasks" */
  update_daily_tasks_by_pk?: Maybe<Daily_Tasks>;
  /** update multiples rows of table: "daily_tasks" */
  update_daily_tasks_many?: Maybe<Array<Maybe<Daily_Tasks_Mutation_Response>>>;
  /** update data of the table: "debug" */
  update_debug?: Maybe<Debug_Mutation_Response>;
  /** update single row of the table: "debug" */
  update_debug_by_pk?: Maybe<Debug>;
  /** update multiples rows of table: "debug" */
  update_debug_many?: Maybe<Array<Maybe<Debug_Mutation_Response>>>;
  /** update data of the table: "error_log" */
  update_error_log?: Maybe<Error_Log_Mutation_Response>;
  /** update single row of the table: "error_log" */
  update_error_log_by_pk?: Maybe<Error_Log>;
  /** update multiples rows of table: "error_log" */
  update_error_log_many?: Maybe<Array<Maybe<Error_Log_Mutation_Response>>>;
  /** update data of the table: "storage.files_blob" */
  update_filesBlob?: Maybe<FilesBlob_Mutation_Response>;
  /** update single row of the table: "storage.files_blob" */
  update_filesBlob_by_pk?: Maybe<FilesBlob>;
  /** update multiples rows of table: "storage.files_blob" */
  update_filesBlob_many?: Maybe<Array<Maybe<FilesBlob_Mutation_Response>>>;
  /** update multiples rows of table: "storage.files" */
  update_files_many?: Maybe<Array<Maybe<Files_Mutation_Response>>>;
  /** update data of the table: "github_issues" */
  update_github_issues?: Maybe<Github_Issues_Mutation_Response>;
  /** update single row of the table: "github_issues" */
  update_github_issues_by_pk?: Maybe<Github_Issues>;
  /** update multiples rows of table: "github_issues" */
  update_github_issues_many?: Maybe<
    Array<Maybe<Github_Issues_Mutation_Response>>
  >;
  /** update data of the table: "invites" */
  update_invites?: Maybe<Invites_Mutation_Response>;
  /** update single row of the table: "invites" */
  update_invites_by_pk?: Maybe<Invites>;
  /** update multiples rows of table: "invites" */
  update_invites_many?: Maybe<Array<Maybe<Invites_Mutation_Response>>>;
  /** update data of the table: "logs.diffs" */
  update_logs_diffs?: Maybe<Logs_Diffs_Mutation_Response>;
  /** update single row of the table: "logs.diffs" */
  update_logs_diffs_by_pk?: Maybe<Logs_Diffs>;
  /** update multiples rows of table: "logs.diffs" */
  update_logs_diffs_many?: Maybe<Array<Maybe<Logs_Diffs_Mutation_Response>>>;
  /** update data of the table: "notification_messages" */
  update_notification_messages?: Maybe<Notification_Messages_Mutation_Response>;
  /** update single row of the table: "notification_messages" */
  update_notification_messages_by_pk?: Maybe<Notification_Messages>;
  /** update multiples rows of table: "notification_messages" */
  update_notification_messages_many?: Maybe<
    Array<Maybe<Notification_Messages_Mutation_Response>>
  >;
  /** update data of the table: "notification_permissions" */
  update_notification_permissions?: Maybe<Notification_Permissions_Mutation_Response>;
  /** update single row of the table: "notification_permissions" */
  update_notification_permissions_by_pk?: Maybe<Notification_Permissions>;
  /** update multiples rows of table: "notification_permissions" */
  update_notification_permissions_many?: Maybe<
    Array<Maybe<Notification_Permissions_Mutation_Response>>
  >;
  /** update data of the table: "notifications" */
  update_notifications?: Maybe<Notifications_Mutation_Response>;
  /** update single row of the table: "notifications" */
  update_notifications_by_pk?: Maybe<Notifications>;
  /** update multiples rows of table: "notifications" */
  update_notifications_many?: Maybe<
    Array<Maybe<Notifications_Mutation_Response>>
  >;
  /** update data of the table: "payments.methods" */
  update_payments_methods?: Maybe<Payments_Methods_Mutation_Response>;
  /** update single row of the table: "payments.methods" */
  update_payments_methods_by_pk?: Maybe<Payments_Methods>;
  /** update multiples rows of table: "payments.methods" */
  update_payments_methods_many?: Maybe<
    Array<Maybe<Payments_Methods_Mutation_Response>>
  >;
  /** update data of the table: "payments.operations" */
  update_payments_operations?: Maybe<Payments_Operations_Mutation_Response>;
  /** update single row of the table: "payments.operations" */
  update_payments_operations_by_pk?: Maybe<Payments_Operations>;
  /** update multiples rows of table: "payments.operations" */
  update_payments_operations_many?: Maybe<
    Array<Maybe<Payments_Operations_Mutation_Response>>
  >;
  /** update data of the table: "payments.plans" */
  update_payments_plans?: Maybe<Payments_Plans_Mutation_Response>;
  /** update single row of the table: "payments.plans" */
  update_payments_plans_by_pk?: Maybe<Payments_Plans>;
  /** update multiples rows of table: "payments.plans" */
  update_payments_plans_many?: Maybe<
    Array<Maybe<Payments_Plans_Mutation_Response>>
  >;
  /** update data of the table: "payments.providers" */
  update_payments_providers?: Maybe<Payments_Providers_Mutation_Response>;
  /** update single row of the table: "payments.providers" */
  update_payments_providers_by_pk?: Maybe<Payments_Providers>;
  /** update multiples rows of table: "payments.providers" */
  update_payments_providers_many?: Maybe<
    Array<Maybe<Payments_Providers_Mutation_Response>>
  >;
  /** update data of the table: "payments.subscriptions" */
  update_payments_subscriptions?: Maybe<Payments_Subscriptions_Mutation_Response>;
  /** update single row of the table: "payments.subscriptions" */
  update_payments_subscriptions_by_pk?: Maybe<Payments_Subscriptions>;
  /** update multiples rows of table: "payments.subscriptions" */
  update_payments_subscriptions_many?: Maybe<
    Array<Maybe<Payments_Subscriptions_Mutation_Response>>
  >;
  /** update data of the table: "payments.user_payment_provider_mappings" */
  update_payments_user_payment_provider_mappings?: Maybe<Payments_User_Payment_Provider_Mappings_Mutation_Response>;
  /** update single row of the table: "payments.user_payment_provider_mappings" */
  update_payments_user_payment_provider_mappings_by_pk?: Maybe<Payments_User_Payment_Provider_Mappings>;
  /** update multiples rows of table: "payments.user_payment_provider_mappings" */
  update_payments_user_payment_provider_mappings_many?: Maybe<
    Array<Maybe<Payments_User_Payment_Provider_Mappings_Mutation_Response>>
  >;
  /** update data of the table: "progress_metrics" */
  update_progress_metrics?: Maybe<Progress_Metrics_Mutation_Response>;
  /** update single row of the table: "progress_metrics" */
  update_progress_metrics_by_pk?: Maybe<Progress_Metrics>;
  /** update multiples rows of table: "progress_metrics" */
  update_progress_metrics_many?: Maybe<
    Array<Maybe<Progress_Metrics_Mutation_Response>>
  >;
  /** update data of the table: "review_history" */
  update_review_history?: Maybe<Review_History_Mutation_Response>;
  /** update single row of the table: "review_history" */
  update_review_history_by_pk?: Maybe<Review_History>;
  /** update multiples rows of table: "review_history" */
  update_review_history_many?: Maybe<
    Array<Maybe<Review_History_Mutation_Response>>
  >;
  /** update data of the table: "stage_progress" */
  update_stage_progress?: Maybe<Stage_Progress_Mutation_Response>;
  /** update single row of the table: "stage_progress" */
  update_stage_progress_by_pk?: Maybe<Stage_Progress>;
  /** update multiples rows of table: "stage_progress" */
  update_stage_progress_many?: Maybe<
    Array<Maybe<Stage_Progress_Mutation_Response>>
  >;
  /** update data of the table: "stage_requirements" */
  update_stage_requirements?: Maybe<Stage_Requirements_Mutation_Response>;
  /** update single row of the table: "stage_requirements" */
  update_stage_requirements_by_pk?: Maybe<Stage_Requirements>;
  /** update multiples rows of table: "stage_requirements" */
  update_stage_requirements_many?: Maybe<
    Array<Maybe<Stage_Requirements_Mutation_Response>>
  >;
  /** update data of the table: "stage_tests" */
  update_stage_tests?: Maybe<Stage_Tests_Mutation_Response>;
  /** update single row of the table: "stage_tests" */
  update_stage_tests_by_pk?: Maybe<Stage_Tests>;
  /** update multiples rows of table: "stage_tests" */
  update_stage_tests_many?: Maybe<Array<Maybe<Stage_Tests_Mutation_Response>>>;
  /** update data of the table: "streaks" */
  update_streaks?: Maybe<Streaks_Mutation_Response>;
  /** update single row of the table: "streaks" */
  update_streaks_by_pk?: Maybe<Streaks>;
  /** update multiples rows of table: "streaks" */
  update_streaks_many?: Maybe<Array<Maybe<Streaks_Mutation_Response>>>;
  /** update data of the table: "study_stages" */
  update_study_stages?: Maybe<Study_Stages_Mutation_Response>;
  /** update single row of the table: "study_stages" */
  update_study_stages_by_pk?: Maybe<Study_Stages>;
  /** update multiples rows of table: "study_stages" */
  update_study_stages_many?: Maybe<
    Array<Maybe<Study_Stages_Mutation_Response>>
  >;
  /** update data of the table: "users" */
  update_users?: Maybe<Users_Mutation_Response>;
  /** update single row of the table: "users" */
  update_users_by_pk?: Maybe<Users>;
  /** update multiples rows of table: "users" */
  update_users_many?: Maybe<Array<Maybe<Users_Mutation_Response>>>;
  /** update data of the table: "verification_codes" */
  update_verification_codes?: Maybe<Verification_Codes_Mutation_Response>;
  /** update single row of the table: "verification_codes" */
  update_verification_codes_by_pk?: Maybe<Verification_Codes>;
  /** update multiples rows of table: "verification_codes" */
  update_verification_codes_many?: Maybe<
    Array<Maybe<Verification_Codes_Mutation_Response>>
  >;
  /** update multiples rows of table: "storage.virus" */
  update_virus_many?: Maybe<Array<Maybe<Virus_Mutation_Response>>>;
  /** update data of the table: "vocabulary_cards" */
  update_vocabulary_cards?: Maybe<Vocabulary_Cards_Mutation_Response>;
  /** update single row of the table: "vocabulary_cards" */
  update_vocabulary_cards_by_pk?: Maybe<Vocabulary_Cards>;
  /** update multiples rows of table: "vocabulary_cards" */
  update_vocabulary_cards_many?: Maybe<
    Array<Maybe<Vocabulary_Cards_Mutation_Response>>
  >;
  /** update data of the table: "weekly_structure" */
  update_weekly_structure?: Maybe<Weekly_Structure_Mutation_Response>;
  /** update single row of the table: "weekly_structure" */
  update_weekly_structure_by_pk?: Maybe<Weekly_Structure>;
  /** update multiples rows of table: "weekly_structure" */
  update_weekly_structure_many?: Maybe<
    Array<Maybe<Weekly_Structure_Mutation_Response>>
  >;
};

/** mutation root */
export type Mutation_RootDeleteBucketArgs = {
  id: Scalars["String"]["input"];
};

/** mutation root */
export type Mutation_RootDeleteBucketsArgs = {
  where: Buckets_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDeleteFileArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDeleteFileBlobArgs = {
  fileId: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDeleteFilesArgs = {
  where: Files_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDeleteFilesBlobsArgs = {
  where: FilesBlob_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDeleteVirusArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDeleteVirusesArgs = {
  where: Virus_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_AccountsArgs = {
  where: Accounts_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Accounts_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_AchievementsArgs = {
  where: Achievements_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Achievements_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Ai_SessionsArgs = {
  where: Ai_Sessions_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Ai_Sessions_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Auth_JwtArgs = {
  where: Auth_Jwt_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Auth_Jwt_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Daily_TasksArgs = {
  where: Daily_Tasks_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Daily_Tasks_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_DebugArgs = {
  where: Debug_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Debug_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Error_LogArgs = {
  where: Error_Log_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Error_Log_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Github_IssuesArgs = {
  where: Github_Issues_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Github_Issues_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_InvitesArgs = {
  where: Invites_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Invites_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Logs_DiffsArgs = {
  where: Logs_Diffs_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Logs_Diffs_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Notification_MessagesArgs = {
  where: Notification_Messages_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Notification_Messages_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Notification_PermissionsArgs = {
  where: Notification_Permissions_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Notification_Permissions_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_NotificationsArgs = {
  where: Notifications_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Notifications_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Payments_MethodsArgs = {
  where: Payments_Methods_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Payments_Methods_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Payments_OperationsArgs = {
  where: Payments_Operations_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Payments_Operations_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Payments_PlansArgs = {
  where: Payments_Plans_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Payments_Plans_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Payments_ProvidersArgs = {
  where: Payments_Providers_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Payments_Providers_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Payments_SubscriptionsArgs = {
  where: Payments_Subscriptions_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Payments_Subscriptions_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Payments_User_Payment_Provider_MappingsArgs = {
  where: Payments_User_Payment_Provider_Mappings_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Payments_User_Payment_Provider_Mappings_By_PkArgs =
  {
    id: Scalars["uuid"]["input"];
  };

/** mutation root */
export type Mutation_RootDelete_Progress_MetricsArgs = {
  where: Progress_Metrics_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Progress_Metrics_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Review_HistoryArgs = {
  where: Review_History_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Review_History_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Stage_ProgressArgs = {
  where: Stage_Progress_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Stage_Progress_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Stage_RequirementsArgs = {
  where: Stage_Requirements_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Stage_Requirements_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Stage_TestsArgs = {
  where: Stage_Tests_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Stage_Tests_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_StreaksArgs = {
  where: Streaks_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Streaks_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Study_StagesArgs = {
  where: Study_Stages_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Study_Stages_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_UsersArgs = {
  where: Users_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Users_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Verification_CodesArgs = {
  where: Verification_Codes_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Verification_Codes_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Vocabulary_CardsArgs = {
  where: Vocabulary_Cards_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Vocabulary_Cards_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Weekly_StructureArgs = {
  where: Weekly_Structure_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Weekly_Structure_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootInsertBucketArgs = {
  object: Buckets_Insert_Input;
  on_conflict?: InputMaybe<Buckets_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsertBucketsArgs = {
  objects: Array<Buckets_Insert_Input>;
  on_conflict?: InputMaybe<Buckets_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsertFileArgs = {
  object: Files_Insert_Input;
  on_conflict?: InputMaybe<Files_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsertFileBlobArgs = {
  object: FilesBlob_Insert_Input;
  on_conflict?: InputMaybe<FilesBlob_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsertFilesArgs = {
  objects: Array<Files_Insert_Input>;
  on_conflict?: InputMaybe<Files_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsertFilesBlobsArgs = {
  objects: Array<FilesBlob_Insert_Input>;
  on_conflict?: InputMaybe<FilesBlob_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsertVirusArgs = {
  object: Virus_Insert_Input;
  on_conflict?: InputMaybe<Virus_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsertVirusesArgs = {
  objects: Array<Virus_Insert_Input>;
  on_conflict?: InputMaybe<Virus_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_AccountsArgs = {
  objects: Array<Accounts_Insert_Input>;
  on_conflict?: InputMaybe<Accounts_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Accounts_OneArgs = {
  object: Accounts_Insert_Input;
  on_conflict?: InputMaybe<Accounts_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_AchievementsArgs = {
  objects: Array<Achievements_Insert_Input>;
  on_conflict?: InputMaybe<Achievements_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Achievements_OneArgs = {
  object: Achievements_Insert_Input;
  on_conflict?: InputMaybe<Achievements_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Ai_SessionsArgs = {
  objects: Array<Ai_Sessions_Insert_Input>;
  on_conflict?: InputMaybe<Ai_Sessions_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Ai_Sessions_OneArgs = {
  object: Ai_Sessions_Insert_Input;
  on_conflict?: InputMaybe<Ai_Sessions_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Auth_JwtArgs = {
  objects: Array<Auth_Jwt_Insert_Input>;
  on_conflict?: InputMaybe<Auth_Jwt_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Auth_Jwt_OneArgs = {
  object: Auth_Jwt_Insert_Input;
  on_conflict?: InputMaybe<Auth_Jwt_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Daily_TasksArgs = {
  objects: Array<Daily_Tasks_Insert_Input>;
  on_conflict?: InputMaybe<Daily_Tasks_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Daily_Tasks_OneArgs = {
  object: Daily_Tasks_Insert_Input;
  on_conflict?: InputMaybe<Daily_Tasks_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_DebugArgs = {
  objects: Array<Debug_Insert_Input>;
  on_conflict?: InputMaybe<Debug_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Debug_OneArgs = {
  object: Debug_Insert_Input;
  on_conflict?: InputMaybe<Debug_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Error_LogArgs = {
  objects: Array<Error_Log_Insert_Input>;
  on_conflict?: InputMaybe<Error_Log_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Error_Log_OneArgs = {
  object: Error_Log_Insert_Input;
  on_conflict?: InputMaybe<Error_Log_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Github_IssuesArgs = {
  objects: Array<Github_Issues_Insert_Input>;
  on_conflict?: InputMaybe<Github_Issues_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Github_Issues_OneArgs = {
  object: Github_Issues_Insert_Input;
  on_conflict?: InputMaybe<Github_Issues_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_InvitesArgs = {
  objects: Array<Invites_Insert_Input>;
  on_conflict?: InputMaybe<Invites_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Invites_OneArgs = {
  object: Invites_Insert_Input;
  on_conflict?: InputMaybe<Invites_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Logs_DiffsArgs = {
  objects: Array<Logs_Diffs_Insert_Input>;
  on_conflict?: InputMaybe<Logs_Diffs_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Logs_Diffs_OneArgs = {
  object: Logs_Diffs_Insert_Input;
  on_conflict?: InputMaybe<Logs_Diffs_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Notification_MessagesArgs = {
  objects: Array<Notification_Messages_Insert_Input>;
  on_conflict?: InputMaybe<Notification_Messages_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Notification_Messages_OneArgs = {
  object: Notification_Messages_Insert_Input;
  on_conflict?: InputMaybe<Notification_Messages_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Notification_PermissionsArgs = {
  objects: Array<Notification_Permissions_Insert_Input>;
  on_conflict?: InputMaybe<Notification_Permissions_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Notification_Permissions_OneArgs = {
  object: Notification_Permissions_Insert_Input;
  on_conflict?: InputMaybe<Notification_Permissions_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_NotificationsArgs = {
  objects: Array<Notifications_Insert_Input>;
  on_conflict?: InputMaybe<Notifications_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Notifications_OneArgs = {
  object: Notifications_Insert_Input;
  on_conflict?: InputMaybe<Notifications_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_MethodsArgs = {
  objects: Array<Payments_Methods_Insert_Input>;
  on_conflict?: InputMaybe<Payments_Methods_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_Methods_OneArgs = {
  object: Payments_Methods_Insert_Input;
  on_conflict?: InputMaybe<Payments_Methods_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_OperationsArgs = {
  objects: Array<Payments_Operations_Insert_Input>;
  on_conflict?: InputMaybe<Payments_Operations_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_Operations_OneArgs = {
  object: Payments_Operations_Insert_Input;
  on_conflict?: InputMaybe<Payments_Operations_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_PlansArgs = {
  objects: Array<Payments_Plans_Insert_Input>;
  on_conflict?: InputMaybe<Payments_Plans_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_Plans_OneArgs = {
  object: Payments_Plans_Insert_Input;
  on_conflict?: InputMaybe<Payments_Plans_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_ProvidersArgs = {
  objects: Array<Payments_Providers_Insert_Input>;
  on_conflict?: InputMaybe<Payments_Providers_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_Providers_OneArgs = {
  object: Payments_Providers_Insert_Input;
  on_conflict?: InputMaybe<Payments_Providers_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_SubscriptionsArgs = {
  objects: Array<Payments_Subscriptions_Insert_Input>;
  on_conflict?: InputMaybe<Payments_Subscriptions_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_Subscriptions_OneArgs = {
  object: Payments_Subscriptions_Insert_Input;
  on_conflict?: InputMaybe<Payments_Subscriptions_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_User_Payment_Provider_MappingsArgs = {
  objects: Array<Payments_User_Payment_Provider_Mappings_Insert_Input>;
  on_conflict?: InputMaybe<Payments_User_Payment_Provider_Mappings_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Payments_User_Payment_Provider_Mappings_OneArgs =
  {
    object: Payments_User_Payment_Provider_Mappings_Insert_Input;
    on_conflict?: InputMaybe<Payments_User_Payment_Provider_Mappings_On_Conflict>;
  };

/** mutation root */
export type Mutation_RootInsert_Progress_MetricsArgs = {
  objects: Array<Progress_Metrics_Insert_Input>;
  on_conflict?: InputMaybe<Progress_Metrics_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Progress_Metrics_OneArgs = {
  object: Progress_Metrics_Insert_Input;
  on_conflict?: InputMaybe<Progress_Metrics_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Review_HistoryArgs = {
  objects: Array<Review_History_Insert_Input>;
  on_conflict?: InputMaybe<Review_History_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Review_History_OneArgs = {
  object: Review_History_Insert_Input;
  on_conflict?: InputMaybe<Review_History_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Stage_ProgressArgs = {
  objects: Array<Stage_Progress_Insert_Input>;
  on_conflict?: InputMaybe<Stage_Progress_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Stage_Progress_OneArgs = {
  object: Stage_Progress_Insert_Input;
  on_conflict?: InputMaybe<Stage_Progress_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Stage_RequirementsArgs = {
  objects: Array<Stage_Requirements_Insert_Input>;
  on_conflict?: InputMaybe<Stage_Requirements_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Stage_Requirements_OneArgs = {
  object: Stage_Requirements_Insert_Input;
  on_conflict?: InputMaybe<Stage_Requirements_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Stage_TestsArgs = {
  objects: Array<Stage_Tests_Insert_Input>;
  on_conflict?: InputMaybe<Stage_Tests_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Stage_Tests_OneArgs = {
  object: Stage_Tests_Insert_Input;
  on_conflict?: InputMaybe<Stage_Tests_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_StreaksArgs = {
  objects: Array<Streaks_Insert_Input>;
  on_conflict?: InputMaybe<Streaks_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Streaks_OneArgs = {
  object: Streaks_Insert_Input;
  on_conflict?: InputMaybe<Streaks_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Study_StagesArgs = {
  objects: Array<Study_Stages_Insert_Input>;
  on_conflict?: InputMaybe<Study_Stages_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Study_Stages_OneArgs = {
  object: Study_Stages_Insert_Input;
  on_conflict?: InputMaybe<Study_Stages_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_UsersArgs = {
  objects: Array<Users_Insert_Input>;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Users_OneArgs = {
  object: Users_Insert_Input;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Verification_CodesArgs = {
  objects: Array<Verification_Codes_Insert_Input>;
  on_conflict?: InputMaybe<Verification_Codes_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Verification_Codes_OneArgs = {
  object: Verification_Codes_Insert_Input;
  on_conflict?: InputMaybe<Verification_Codes_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Vocabulary_CardsArgs = {
  objects: Array<Vocabulary_Cards_Insert_Input>;
  on_conflict?: InputMaybe<Vocabulary_Cards_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Vocabulary_Cards_OneArgs = {
  object: Vocabulary_Cards_Insert_Input;
  on_conflict?: InputMaybe<Vocabulary_Cards_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Weekly_StructureArgs = {
  objects: Array<Weekly_Structure_Insert_Input>;
  on_conflict?: InputMaybe<Weekly_Structure_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Weekly_Structure_OneArgs = {
  object: Weekly_Structure_Insert_Input;
  on_conflict?: InputMaybe<Weekly_Structure_On_Conflict>;
};

/** mutation root */
export type Mutation_RootUpdateBucketArgs = {
  _inc?: InputMaybe<Buckets_Inc_Input>;
  _set?: InputMaybe<Buckets_Set_Input>;
  pk_columns: Buckets_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdateBucketsArgs = {
  _inc?: InputMaybe<Buckets_Inc_Input>;
  _set?: InputMaybe<Buckets_Set_Input>;
  where: Buckets_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdateFileArgs = {
  _append?: InputMaybe<Files_Append_Input>;
  _delete_at_path?: InputMaybe<Files_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Files_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Files_Delete_Key_Input>;
  _inc?: InputMaybe<Files_Inc_Input>;
  _prepend?: InputMaybe<Files_Prepend_Input>;
  _set?: InputMaybe<Files_Set_Input>;
  pk_columns: Files_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdateFilesArgs = {
  _append?: InputMaybe<Files_Append_Input>;
  _delete_at_path?: InputMaybe<Files_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Files_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Files_Delete_Key_Input>;
  _inc?: InputMaybe<Files_Inc_Input>;
  _prepend?: InputMaybe<Files_Prepend_Input>;
  _set?: InputMaybe<Files_Set_Input>;
  where: Files_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdateVirusArgs = {
  _append?: InputMaybe<Virus_Append_Input>;
  _delete_at_path?: InputMaybe<Virus_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Virus_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Virus_Delete_Key_Input>;
  _prepend?: InputMaybe<Virus_Prepend_Input>;
  _set?: InputMaybe<Virus_Set_Input>;
  pk_columns: Virus_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdateVirusesArgs = {
  _append?: InputMaybe<Virus_Append_Input>;
  _delete_at_path?: InputMaybe<Virus_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Virus_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Virus_Delete_Key_Input>;
  _prepend?: InputMaybe<Virus_Prepend_Input>;
  _set?: InputMaybe<Virus_Set_Input>;
  where: Virus_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_AccountsArgs = {
  _append?: InputMaybe<Accounts_Append_Input>;
  _delete_at_path?: InputMaybe<Accounts_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Accounts_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Accounts_Delete_Key_Input>;
  _inc?: InputMaybe<Accounts_Inc_Input>;
  _prepend?: InputMaybe<Accounts_Prepend_Input>;
  _set?: InputMaybe<Accounts_Set_Input>;
  where: Accounts_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Accounts_By_PkArgs = {
  _append?: InputMaybe<Accounts_Append_Input>;
  _delete_at_path?: InputMaybe<Accounts_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Accounts_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Accounts_Delete_Key_Input>;
  _inc?: InputMaybe<Accounts_Inc_Input>;
  _prepend?: InputMaybe<Accounts_Prepend_Input>;
  _set?: InputMaybe<Accounts_Set_Input>;
  pk_columns: Accounts_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Accounts_ManyArgs = {
  updates: Array<Accounts_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_AchievementsArgs = {
  _set?: InputMaybe<Achievements_Set_Input>;
  where: Achievements_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Achievements_By_PkArgs = {
  _set?: InputMaybe<Achievements_Set_Input>;
  pk_columns: Achievements_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Achievements_ManyArgs = {
  updates: Array<Achievements_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Ai_SessionsArgs = {
  _append?: InputMaybe<Ai_Sessions_Append_Input>;
  _delete_at_path?: InputMaybe<Ai_Sessions_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Ai_Sessions_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Ai_Sessions_Delete_Key_Input>;
  _inc?: InputMaybe<Ai_Sessions_Inc_Input>;
  _prepend?: InputMaybe<Ai_Sessions_Prepend_Input>;
  _set?: InputMaybe<Ai_Sessions_Set_Input>;
  where: Ai_Sessions_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Ai_Sessions_By_PkArgs = {
  _append?: InputMaybe<Ai_Sessions_Append_Input>;
  _delete_at_path?: InputMaybe<Ai_Sessions_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Ai_Sessions_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Ai_Sessions_Delete_Key_Input>;
  _inc?: InputMaybe<Ai_Sessions_Inc_Input>;
  _prepend?: InputMaybe<Ai_Sessions_Prepend_Input>;
  _set?: InputMaybe<Ai_Sessions_Set_Input>;
  pk_columns: Ai_Sessions_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Ai_Sessions_ManyArgs = {
  updates: Array<Ai_Sessions_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Auth_JwtArgs = {
  _inc?: InputMaybe<Auth_Jwt_Inc_Input>;
  _set?: InputMaybe<Auth_Jwt_Set_Input>;
  where: Auth_Jwt_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Auth_Jwt_By_PkArgs = {
  _inc?: InputMaybe<Auth_Jwt_Inc_Input>;
  _set?: InputMaybe<Auth_Jwt_Set_Input>;
  pk_columns: Auth_Jwt_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Auth_Jwt_ManyArgs = {
  updates: Array<Auth_Jwt_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Buckets_ManyArgs = {
  updates: Array<Buckets_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Daily_TasksArgs = {
  _append?: InputMaybe<Daily_Tasks_Append_Input>;
  _delete_at_path?: InputMaybe<Daily_Tasks_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Daily_Tasks_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Daily_Tasks_Delete_Key_Input>;
  _inc?: InputMaybe<Daily_Tasks_Inc_Input>;
  _prepend?: InputMaybe<Daily_Tasks_Prepend_Input>;
  _set?: InputMaybe<Daily_Tasks_Set_Input>;
  where: Daily_Tasks_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Daily_Tasks_By_PkArgs = {
  _append?: InputMaybe<Daily_Tasks_Append_Input>;
  _delete_at_path?: InputMaybe<Daily_Tasks_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Daily_Tasks_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Daily_Tasks_Delete_Key_Input>;
  _inc?: InputMaybe<Daily_Tasks_Inc_Input>;
  _prepend?: InputMaybe<Daily_Tasks_Prepend_Input>;
  _set?: InputMaybe<Daily_Tasks_Set_Input>;
  pk_columns: Daily_Tasks_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Daily_Tasks_ManyArgs = {
  updates: Array<Daily_Tasks_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_DebugArgs = {
  _append?: InputMaybe<Debug_Append_Input>;
  _delete_at_path?: InputMaybe<Debug_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Debug_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Debug_Delete_Key_Input>;
  _inc?: InputMaybe<Debug_Inc_Input>;
  _prepend?: InputMaybe<Debug_Prepend_Input>;
  _set?: InputMaybe<Debug_Set_Input>;
  where: Debug_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Debug_By_PkArgs = {
  _append?: InputMaybe<Debug_Append_Input>;
  _delete_at_path?: InputMaybe<Debug_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Debug_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Debug_Delete_Key_Input>;
  _inc?: InputMaybe<Debug_Inc_Input>;
  _prepend?: InputMaybe<Debug_Prepend_Input>;
  _set?: InputMaybe<Debug_Set_Input>;
  pk_columns: Debug_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Debug_ManyArgs = {
  updates: Array<Debug_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Error_LogArgs = {
  _inc?: InputMaybe<Error_Log_Inc_Input>;
  _set?: InputMaybe<Error_Log_Set_Input>;
  where: Error_Log_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Error_Log_By_PkArgs = {
  _inc?: InputMaybe<Error_Log_Inc_Input>;
  _set?: InputMaybe<Error_Log_Set_Input>;
  pk_columns: Error_Log_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Error_Log_ManyArgs = {
  updates: Array<Error_Log_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_FilesBlobArgs = {
  _set?: InputMaybe<FilesBlob_Set_Input>;
  where: FilesBlob_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_FilesBlob_By_PkArgs = {
  _set?: InputMaybe<FilesBlob_Set_Input>;
  pk_columns: FilesBlob_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_FilesBlob_ManyArgs = {
  updates: Array<FilesBlob_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Files_ManyArgs = {
  updates: Array<Files_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Github_IssuesArgs = {
  _append?: InputMaybe<Github_Issues_Append_Input>;
  _delete_at_path?: InputMaybe<Github_Issues_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Github_Issues_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Github_Issues_Delete_Key_Input>;
  _inc?: InputMaybe<Github_Issues_Inc_Input>;
  _prepend?: InputMaybe<Github_Issues_Prepend_Input>;
  _set?: InputMaybe<Github_Issues_Set_Input>;
  where: Github_Issues_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Github_Issues_By_PkArgs = {
  _append?: InputMaybe<Github_Issues_Append_Input>;
  _delete_at_path?: InputMaybe<Github_Issues_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Github_Issues_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Github_Issues_Delete_Key_Input>;
  _inc?: InputMaybe<Github_Issues_Inc_Input>;
  _prepend?: InputMaybe<Github_Issues_Prepend_Input>;
  _set?: InputMaybe<Github_Issues_Set_Input>;
  pk_columns: Github_Issues_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Github_Issues_ManyArgs = {
  updates: Array<Github_Issues_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_InvitesArgs = {
  _inc?: InputMaybe<Invites_Inc_Input>;
  _set?: InputMaybe<Invites_Set_Input>;
  where: Invites_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Invites_By_PkArgs = {
  _inc?: InputMaybe<Invites_Inc_Input>;
  _set?: InputMaybe<Invites_Set_Input>;
  pk_columns: Invites_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Invites_ManyArgs = {
  updates: Array<Invites_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Logs_DiffsArgs = {
  _inc?: InputMaybe<Logs_Diffs_Inc_Input>;
  _set?: InputMaybe<Logs_Diffs_Set_Input>;
  where: Logs_Diffs_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Logs_Diffs_By_PkArgs = {
  _inc?: InputMaybe<Logs_Diffs_Inc_Input>;
  _set?: InputMaybe<Logs_Diffs_Set_Input>;
  pk_columns: Logs_Diffs_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Logs_Diffs_ManyArgs = {
  updates: Array<Logs_Diffs_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Notification_MessagesArgs = {
  _append?: InputMaybe<Notification_Messages_Append_Input>;
  _delete_at_path?: InputMaybe<Notification_Messages_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Notification_Messages_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Notification_Messages_Delete_Key_Input>;
  _inc?: InputMaybe<Notification_Messages_Inc_Input>;
  _prepend?: InputMaybe<Notification_Messages_Prepend_Input>;
  _set?: InputMaybe<Notification_Messages_Set_Input>;
  where: Notification_Messages_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Notification_Messages_By_PkArgs = {
  _append?: InputMaybe<Notification_Messages_Append_Input>;
  _delete_at_path?: InputMaybe<Notification_Messages_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Notification_Messages_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Notification_Messages_Delete_Key_Input>;
  _inc?: InputMaybe<Notification_Messages_Inc_Input>;
  _prepend?: InputMaybe<Notification_Messages_Prepend_Input>;
  _set?: InputMaybe<Notification_Messages_Set_Input>;
  pk_columns: Notification_Messages_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Notification_Messages_ManyArgs = {
  updates: Array<Notification_Messages_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Notification_PermissionsArgs = {
  _append?: InputMaybe<Notification_Permissions_Append_Input>;
  _delete_at_path?: InputMaybe<Notification_Permissions_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Notification_Permissions_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Notification_Permissions_Delete_Key_Input>;
  _inc?: InputMaybe<Notification_Permissions_Inc_Input>;
  _prepend?: InputMaybe<Notification_Permissions_Prepend_Input>;
  _set?: InputMaybe<Notification_Permissions_Set_Input>;
  where: Notification_Permissions_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Notification_Permissions_By_PkArgs = {
  _append?: InputMaybe<Notification_Permissions_Append_Input>;
  _delete_at_path?: InputMaybe<Notification_Permissions_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Notification_Permissions_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Notification_Permissions_Delete_Key_Input>;
  _inc?: InputMaybe<Notification_Permissions_Inc_Input>;
  _prepend?: InputMaybe<Notification_Permissions_Prepend_Input>;
  _set?: InputMaybe<Notification_Permissions_Set_Input>;
  pk_columns: Notification_Permissions_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Notification_Permissions_ManyArgs = {
  updates: Array<Notification_Permissions_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_NotificationsArgs = {
  _append?: InputMaybe<Notifications_Append_Input>;
  _delete_at_path?: InputMaybe<Notifications_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Notifications_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Notifications_Delete_Key_Input>;
  _inc?: InputMaybe<Notifications_Inc_Input>;
  _prepend?: InputMaybe<Notifications_Prepend_Input>;
  _set?: InputMaybe<Notifications_Set_Input>;
  where: Notifications_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Notifications_By_PkArgs = {
  _append?: InputMaybe<Notifications_Append_Input>;
  _delete_at_path?: InputMaybe<Notifications_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Notifications_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Notifications_Delete_Key_Input>;
  _inc?: InputMaybe<Notifications_Inc_Input>;
  _prepend?: InputMaybe<Notifications_Prepend_Input>;
  _set?: InputMaybe<Notifications_Set_Input>;
  pk_columns: Notifications_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Notifications_ManyArgs = {
  updates: Array<Notifications_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_MethodsArgs = {
  _append?: InputMaybe<Payments_Methods_Append_Input>;
  _delete_at_path?: InputMaybe<Payments_Methods_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Payments_Methods_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Payments_Methods_Delete_Key_Input>;
  _inc?: InputMaybe<Payments_Methods_Inc_Input>;
  _prepend?: InputMaybe<Payments_Methods_Prepend_Input>;
  _set?: InputMaybe<Payments_Methods_Set_Input>;
  where: Payments_Methods_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Methods_By_PkArgs = {
  _append?: InputMaybe<Payments_Methods_Append_Input>;
  _delete_at_path?: InputMaybe<Payments_Methods_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Payments_Methods_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Payments_Methods_Delete_Key_Input>;
  _inc?: InputMaybe<Payments_Methods_Inc_Input>;
  _prepend?: InputMaybe<Payments_Methods_Prepend_Input>;
  _set?: InputMaybe<Payments_Methods_Set_Input>;
  pk_columns: Payments_Methods_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Methods_ManyArgs = {
  updates: Array<Payments_Methods_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_OperationsArgs = {
  _append?: InputMaybe<Payments_Operations_Append_Input>;
  _delete_at_path?: InputMaybe<Payments_Operations_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Payments_Operations_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Payments_Operations_Delete_Key_Input>;
  _inc?: InputMaybe<Payments_Operations_Inc_Input>;
  _prepend?: InputMaybe<Payments_Operations_Prepend_Input>;
  _set?: InputMaybe<Payments_Operations_Set_Input>;
  where: Payments_Operations_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Operations_By_PkArgs = {
  _append?: InputMaybe<Payments_Operations_Append_Input>;
  _delete_at_path?: InputMaybe<Payments_Operations_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Payments_Operations_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Payments_Operations_Delete_Key_Input>;
  _inc?: InputMaybe<Payments_Operations_Inc_Input>;
  _prepend?: InputMaybe<Payments_Operations_Prepend_Input>;
  _set?: InputMaybe<Payments_Operations_Set_Input>;
  pk_columns: Payments_Operations_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Operations_ManyArgs = {
  updates: Array<Payments_Operations_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_PlansArgs = {
  _append?: InputMaybe<Payments_Plans_Append_Input>;
  _delete_at_path?: InputMaybe<Payments_Plans_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Payments_Plans_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Payments_Plans_Delete_Key_Input>;
  _inc?: InputMaybe<Payments_Plans_Inc_Input>;
  _prepend?: InputMaybe<Payments_Plans_Prepend_Input>;
  _set?: InputMaybe<Payments_Plans_Set_Input>;
  where: Payments_Plans_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Plans_By_PkArgs = {
  _append?: InputMaybe<Payments_Plans_Append_Input>;
  _delete_at_path?: InputMaybe<Payments_Plans_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Payments_Plans_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Payments_Plans_Delete_Key_Input>;
  _inc?: InputMaybe<Payments_Plans_Inc_Input>;
  _prepend?: InputMaybe<Payments_Plans_Prepend_Input>;
  _set?: InputMaybe<Payments_Plans_Set_Input>;
  pk_columns: Payments_Plans_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Plans_ManyArgs = {
  updates: Array<Payments_Plans_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_ProvidersArgs = {
  _append?: InputMaybe<Payments_Providers_Append_Input>;
  _delete_at_path?: InputMaybe<Payments_Providers_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Payments_Providers_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Payments_Providers_Delete_Key_Input>;
  _inc?: InputMaybe<Payments_Providers_Inc_Input>;
  _prepend?: InputMaybe<Payments_Providers_Prepend_Input>;
  _set?: InputMaybe<Payments_Providers_Set_Input>;
  where: Payments_Providers_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Providers_By_PkArgs = {
  _append?: InputMaybe<Payments_Providers_Append_Input>;
  _delete_at_path?: InputMaybe<Payments_Providers_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Payments_Providers_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Payments_Providers_Delete_Key_Input>;
  _inc?: InputMaybe<Payments_Providers_Inc_Input>;
  _prepend?: InputMaybe<Payments_Providers_Prepend_Input>;
  _set?: InputMaybe<Payments_Providers_Set_Input>;
  pk_columns: Payments_Providers_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Providers_ManyArgs = {
  updates: Array<Payments_Providers_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_SubscriptionsArgs = {
  _append?: InputMaybe<Payments_Subscriptions_Append_Input>;
  _delete_at_path?: InputMaybe<Payments_Subscriptions_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Payments_Subscriptions_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Payments_Subscriptions_Delete_Key_Input>;
  _inc?: InputMaybe<Payments_Subscriptions_Inc_Input>;
  _prepend?: InputMaybe<Payments_Subscriptions_Prepend_Input>;
  _set?: InputMaybe<Payments_Subscriptions_Set_Input>;
  where: Payments_Subscriptions_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Subscriptions_By_PkArgs = {
  _append?: InputMaybe<Payments_Subscriptions_Append_Input>;
  _delete_at_path?: InputMaybe<Payments_Subscriptions_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Payments_Subscriptions_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Payments_Subscriptions_Delete_Key_Input>;
  _inc?: InputMaybe<Payments_Subscriptions_Inc_Input>;
  _prepend?: InputMaybe<Payments_Subscriptions_Prepend_Input>;
  _set?: InputMaybe<Payments_Subscriptions_Set_Input>;
  pk_columns: Payments_Subscriptions_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_Subscriptions_ManyArgs = {
  updates: Array<Payments_Subscriptions_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_User_Payment_Provider_MappingsArgs = {
  _append?: InputMaybe<Payments_User_Payment_Provider_Mappings_Append_Input>;
  _delete_at_path?: InputMaybe<Payments_User_Payment_Provider_Mappings_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Payments_User_Payment_Provider_Mappings_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Payments_User_Payment_Provider_Mappings_Delete_Key_Input>;
  _inc?: InputMaybe<Payments_User_Payment_Provider_Mappings_Inc_Input>;
  _prepend?: InputMaybe<Payments_User_Payment_Provider_Mappings_Prepend_Input>;
  _set?: InputMaybe<Payments_User_Payment_Provider_Mappings_Set_Input>;
  where: Payments_User_Payment_Provider_Mappings_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Payments_User_Payment_Provider_Mappings_By_PkArgs =
  {
    _append?: InputMaybe<Payments_User_Payment_Provider_Mappings_Append_Input>;
    _delete_at_path?: InputMaybe<Payments_User_Payment_Provider_Mappings_Delete_At_Path_Input>;
    _delete_elem?: InputMaybe<Payments_User_Payment_Provider_Mappings_Delete_Elem_Input>;
    _delete_key?: InputMaybe<Payments_User_Payment_Provider_Mappings_Delete_Key_Input>;
    _inc?: InputMaybe<Payments_User_Payment_Provider_Mappings_Inc_Input>;
    _prepend?: InputMaybe<Payments_User_Payment_Provider_Mappings_Prepend_Input>;
    _set?: InputMaybe<Payments_User_Payment_Provider_Mappings_Set_Input>;
    pk_columns: Payments_User_Payment_Provider_Mappings_Pk_Columns_Input;
  };

/** mutation root */
export type Mutation_RootUpdate_Payments_User_Payment_Provider_Mappings_ManyArgs =
  {
    updates: Array<Payments_User_Payment_Provider_Mappings_Updates>;
  };

/** mutation root */
export type Mutation_RootUpdate_Progress_MetricsArgs = {
  _inc?: InputMaybe<Progress_Metrics_Inc_Input>;
  _set?: InputMaybe<Progress_Metrics_Set_Input>;
  where: Progress_Metrics_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Progress_Metrics_By_PkArgs = {
  _inc?: InputMaybe<Progress_Metrics_Inc_Input>;
  _set?: InputMaybe<Progress_Metrics_Set_Input>;
  pk_columns: Progress_Metrics_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Progress_Metrics_ManyArgs = {
  updates: Array<Progress_Metrics_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Review_HistoryArgs = {
  _inc?: InputMaybe<Review_History_Inc_Input>;
  _set?: InputMaybe<Review_History_Set_Input>;
  where: Review_History_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Review_History_By_PkArgs = {
  _inc?: InputMaybe<Review_History_Inc_Input>;
  _set?: InputMaybe<Review_History_Set_Input>;
  pk_columns: Review_History_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Review_History_ManyArgs = {
  updates: Array<Review_History_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Stage_ProgressArgs = {
  _inc?: InputMaybe<Stage_Progress_Inc_Input>;
  _set?: InputMaybe<Stage_Progress_Set_Input>;
  where: Stage_Progress_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Stage_Progress_By_PkArgs = {
  _inc?: InputMaybe<Stage_Progress_Inc_Input>;
  _set?: InputMaybe<Stage_Progress_Set_Input>;
  pk_columns: Stage_Progress_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Stage_Progress_ManyArgs = {
  updates: Array<Stage_Progress_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Stage_RequirementsArgs = {
  _inc?: InputMaybe<Stage_Requirements_Inc_Input>;
  _set?: InputMaybe<Stage_Requirements_Set_Input>;
  where: Stage_Requirements_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Stage_Requirements_By_PkArgs = {
  _inc?: InputMaybe<Stage_Requirements_Inc_Input>;
  _set?: InputMaybe<Stage_Requirements_Set_Input>;
  pk_columns: Stage_Requirements_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Stage_Requirements_ManyArgs = {
  updates: Array<Stage_Requirements_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Stage_TestsArgs = {
  _append?: InputMaybe<Stage_Tests_Append_Input>;
  _delete_at_path?: InputMaybe<Stage_Tests_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Stage_Tests_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Stage_Tests_Delete_Key_Input>;
  _inc?: InputMaybe<Stage_Tests_Inc_Input>;
  _prepend?: InputMaybe<Stage_Tests_Prepend_Input>;
  _set?: InputMaybe<Stage_Tests_Set_Input>;
  where: Stage_Tests_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Stage_Tests_By_PkArgs = {
  _append?: InputMaybe<Stage_Tests_Append_Input>;
  _delete_at_path?: InputMaybe<Stage_Tests_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Stage_Tests_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Stage_Tests_Delete_Key_Input>;
  _inc?: InputMaybe<Stage_Tests_Inc_Input>;
  _prepend?: InputMaybe<Stage_Tests_Prepend_Input>;
  _set?: InputMaybe<Stage_Tests_Set_Input>;
  pk_columns: Stage_Tests_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Stage_Tests_ManyArgs = {
  updates: Array<Stage_Tests_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_StreaksArgs = {
  _inc?: InputMaybe<Streaks_Inc_Input>;
  _set?: InputMaybe<Streaks_Set_Input>;
  where: Streaks_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Streaks_By_PkArgs = {
  _inc?: InputMaybe<Streaks_Inc_Input>;
  _set?: InputMaybe<Streaks_Set_Input>;
  pk_columns: Streaks_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Streaks_ManyArgs = {
  updates: Array<Streaks_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Study_StagesArgs = {
  _inc?: InputMaybe<Study_Stages_Inc_Input>;
  _set?: InputMaybe<Study_Stages_Set_Input>;
  where: Study_Stages_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Study_Stages_By_PkArgs = {
  _inc?: InputMaybe<Study_Stages_Inc_Input>;
  _set?: InputMaybe<Study_Stages_Set_Input>;
  pk_columns: Study_Stages_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Study_Stages_ManyArgs = {
  updates: Array<Study_Stages_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_UsersArgs = {
  _inc?: InputMaybe<Users_Inc_Input>;
  _set?: InputMaybe<Users_Set_Input>;
  where: Users_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Users_By_PkArgs = {
  _inc?: InputMaybe<Users_Inc_Input>;
  _set?: InputMaybe<Users_Set_Input>;
  pk_columns: Users_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Users_ManyArgs = {
  updates: Array<Users_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Verification_CodesArgs = {
  _inc?: InputMaybe<Verification_Codes_Inc_Input>;
  _set?: InputMaybe<Verification_Codes_Set_Input>;
  where: Verification_Codes_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Verification_Codes_By_PkArgs = {
  _inc?: InputMaybe<Verification_Codes_Inc_Input>;
  _set?: InputMaybe<Verification_Codes_Set_Input>;
  pk_columns: Verification_Codes_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Verification_Codes_ManyArgs = {
  updates: Array<Verification_Codes_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Virus_ManyArgs = {
  updates: Array<Virus_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Vocabulary_CardsArgs = {
  _inc?: InputMaybe<Vocabulary_Cards_Inc_Input>;
  _set?: InputMaybe<Vocabulary_Cards_Set_Input>;
  where: Vocabulary_Cards_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Vocabulary_Cards_By_PkArgs = {
  _inc?: InputMaybe<Vocabulary_Cards_Inc_Input>;
  _set?: InputMaybe<Vocabulary_Cards_Set_Input>;
  pk_columns: Vocabulary_Cards_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Vocabulary_Cards_ManyArgs = {
  updates: Array<Vocabulary_Cards_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Weekly_StructureArgs = {
  _inc?: InputMaybe<Weekly_Structure_Inc_Input>;
  _set?: InputMaybe<Weekly_Structure_Set_Input>;
  where: Weekly_Structure_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Weekly_Structure_By_PkArgs = {
  _inc?: InputMaybe<Weekly_Structure_Inc_Input>;
  _set?: InputMaybe<Weekly_Structure_Set_Input>;
  pk_columns: Weekly_Structure_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Weekly_Structure_ManyArgs = {
  updates: Array<Weekly_Structure_Updates>;
};

/** columns and relationships of "notification_messages" */
export type Notification_Messages = {
  __typename?: "notification_messages";
  /** Notification body */
  body: Scalars["String"]["output"];
  created_at: Scalars["bigint"]["output"];
  /** Additional notification data */
  data?: Maybe<Scalars["jsonb"]["output"]>;
  id: Scalars["uuid"]["output"];
  /** An array relationship */
  notifications: Array<Notifications>;
  /** An aggregate relationship */
  notifications_aggregate: Notifications_Aggregate;
  /** Notification title */
  title: Scalars["String"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user: Users;
  /** Target user for notification */
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "notification_messages" */
export type Notification_MessagesDataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "notification_messages" */
export type Notification_MessagesNotificationsArgs = {
  distinct_on?: InputMaybe<Array<Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notifications_Order_By>>;
  where?: InputMaybe<Notifications_Bool_Exp>;
};

/** columns and relationships of "notification_messages" */
export type Notification_MessagesNotifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notifications_Order_By>>;
  where?: InputMaybe<Notifications_Bool_Exp>;
};

/** aggregated selection of "notification_messages" */
export type Notification_Messages_Aggregate = {
  __typename?: "notification_messages_aggregate";
  aggregate?: Maybe<Notification_Messages_Aggregate_Fields>;
  nodes: Array<Notification_Messages>;
};

export type Notification_Messages_Aggregate_Bool_Exp = {
  count?: InputMaybe<Notification_Messages_Aggregate_Bool_Exp_Count>;
};

export type Notification_Messages_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Notification_Messages_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Notification_Messages_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "notification_messages" */
export type Notification_Messages_Aggregate_Fields = {
  __typename?: "notification_messages_aggregate_fields";
  avg?: Maybe<Notification_Messages_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Notification_Messages_Max_Fields>;
  min?: Maybe<Notification_Messages_Min_Fields>;
  stddev?: Maybe<Notification_Messages_Stddev_Fields>;
  stddev_pop?: Maybe<Notification_Messages_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Notification_Messages_Stddev_Samp_Fields>;
  sum?: Maybe<Notification_Messages_Sum_Fields>;
  var_pop?: Maybe<Notification_Messages_Var_Pop_Fields>;
  var_samp?: Maybe<Notification_Messages_Var_Samp_Fields>;
  variance?: Maybe<Notification_Messages_Variance_Fields>;
};

/** aggregate fields of "notification_messages" */
export type Notification_Messages_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Notification_Messages_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "notification_messages" */
export type Notification_Messages_Aggregate_Order_By = {
  avg?: InputMaybe<Notification_Messages_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Notification_Messages_Max_Order_By>;
  min?: InputMaybe<Notification_Messages_Min_Order_By>;
  stddev?: InputMaybe<Notification_Messages_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Notification_Messages_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Notification_Messages_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Notification_Messages_Sum_Order_By>;
  var_pop?: InputMaybe<Notification_Messages_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Notification_Messages_Var_Samp_Order_By>;
  variance?: InputMaybe<Notification_Messages_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Notification_Messages_Append_Input = {
  /** Additional notification data */
  data?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "notification_messages" */
export type Notification_Messages_Arr_Rel_Insert_Input = {
  data: Array<Notification_Messages_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Notification_Messages_On_Conflict>;
};

/** aggregate avg on columns */
export type Notification_Messages_Avg_Fields = {
  __typename?: "notification_messages_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "notification_messages" */
export type Notification_Messages_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "notification_messages". All fields are combined with a logical 'AND'. */
export type Notification_Messages_Bool_Exp = {
  _and?: InputMaybe<Array<Notification_Messages_Bool_Exp>>;
  _not?: InputMaybe<Notification_Messages_Bool_Exp>;
  _or?: InputMaybe<Array<Notification_Messages_Bool_Exp>>;
  body?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  data?: InputMaybe<Jsonb_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  notifications?: InputMaybe<Notifications_Bool_Exp>;
  notifications_aggregate?: InputMaybe<Notifications_Aggregate_Bool_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "notification_messages" */
export enum Notification_Messages_Constraint {
  /** unique or primary key constraint on columns "id" */
  NotificationMessagesPkey = "notification_messages_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Notification_Messages_Delete_At_Path_Input = {
  /** Additional notification data */
  data?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Notification_Messages_Delete_Elem_Input = {
  /** Additional notification data */
  data?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Notification_Messages_Delete_Key_Input = {
  /** Additional notification data */
  data?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "notification_messages" */
export type Notification_Messages_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "notification_messages" */
export type Notification_Messages_Insert_Input = {
  /** Notification body */
  body?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Additional notification data */
  data?: InputMaybe<Scalars["jsonb"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  notifications?: InputMaybe<Notifications_Arr_Rel_Insert_Input>;
  /** Notification title */
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** Target user for notification */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Notification_Messages_Max_Fields = {
  __typename?: "notification_messages_max_fields";
  /** Notification body */
  body?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Notification title */
  title?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Target user for notification */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "notification_messages" */
export type Notification_Messages_Max_Order_By = {
  /** Notification body */
  body?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Notification title */
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** Target user for notification */
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Notification_Messages_Min_Fields = {
  __typename?: "notification_messages_min_fields";
  /** Notification body */
  body?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Notification title */
  title?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Target user for notification */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "notification_messages" */
export type Notification_Messages_Min_Order_By = {
  /** Notification body */
  body?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Notification title */
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** Target user for notification */
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "notification_messages" */
export type Notification_Messages_Mutation_Response = {
  __typename?: "notification_messages_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Notification_Messages>;
};

/** input type for inserting object relation for remote table "notification_messages" */
export type Notification_Messages_Obj_Rel_Insert_Input = {
  data: Notification_Messages_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Notification_Messages_On_Conflict>;
};

/** on_conflict condition type for table "notification_messages" */
export type Notification_Messages_On_Conflict = {
  constraint: Notification_Messages_Constraint;
  update_columns?: Array<Notification_Messages_Update_Column>;
  where?: InputMaybe<Notification_Messages_Bool_Exp>;
};

/** Ordering options when selecting data from "notification_messages". */
export type Notification_Messages_Order_By = {
  body?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  data?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  notifications_aggregate?: InputMaybe<Notifications_Aggregate_Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: notification_messages */
export type Notification_Messages_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Notification_Messages_Prepend_Input = {
  /** Additional notification data */
  data?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "notification_messages" */
export enum Notification_Messages_Select_Column {
  /** column name */
  Body = "body",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Data = "data",
  /** column name */
  Id = "id",
  /** column name */
  Title = "title",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "notification_messages" */
export type Notification_Messages_Set_Input = {
  /** Notification body */
  body?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Additional notification data */
  data?: InputMaybe<Scalars["jsonb"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Notification title */
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Target user for notification */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Notification_Messages_Stddev_Fields = {
  __typename?: "notification_messages_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "notification_messages" */
export type Notification_Messages_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Notification_Messages_Stddev_Pop_Fields = {
  __typename?: "notification_messages_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "notification_messages" */
export type Notification_Messages_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Notification_Messages_Stddev_Samp_Fields = {
  __typename?: "notification_messages_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "notification_messages" */
export type Notification_Messages_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "notification_messages" */
export type Notification_Messages_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Notification_Messages_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Notification_Messages_Stream_Cursor_Value_Input = {
  /** Notification body */
  body?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Additional notification data */
  data?: InputMaybe<Scalars["jsonb"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Notification title */
  title?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Target user for notification */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Notification_Messages_Sum_Fields = {
  __typename?: "notification_messages_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "notification_messages" */
export type Notification_Messages_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "notification_messages" */
export enum Notification_Messages_Update_Column {
  /** column name */
  Body = "body",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Data = "data",
  /** column name */
  Id = "id",
  /** column name */
  Title = "title",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Notification_Messages_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Notification_Messages_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Notification_Messages_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Notification_Messages_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Notification_Messages_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Notification_Messages_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Notification_Messages_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Notification_Messages_Set_Input>;
  /** filter the rows which have to be updated */
  where: Notification_Messages_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Notification_Messages_Var_Pop_Fields = {
  __typename?: "notification_messages_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "notification_messages" */
export type Notification_Messages_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Notification_Messages_Var_Samp_Fields = {
  __typename?: "notification_messages_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "notification_messages" */
export type Notification_Messages_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Notification_Messages_Variance_Fields = {
  __typename?: "notification_messages_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "notification_messages" */
export type Notification_Messages_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "notification_permissions" */
export type Notification_Permissions = {
  __typename?: "notification_permissions";
  created_at: Scalars["bigint"]["output"];
  /** Device information */
  device_info: Scalars["jsonb"]["output"];
  /** Device token for push notifications */
  device_token: Scalars["String"]["output"];
  id: Scalars["uuid"]["output"];
  /** An array relationship */
  notifications: Array<Notifications>;
  /** An aggregate relationship */
  notifications_aggregate: Notifications_Aggregate;
  /** Notification provider (e.g., fcm, apns) */
  provider: Scalars["String"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user: Users;
  /** Reference to users table */
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "notification_permissions" */
export type Notification_PermissionsDevice_InfoArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "notification_permissions" */
export type Notification_PermissionsNotificationsArgs = {
  distinct_on?: InputMaybe<Array<Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notifications_Order_By>>;
  where?: InputMaybe<Notifications_Bool_Exp>;
};

/** columns and relationships of "notification_permissions" */
export type Notification_PermissionsNotifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notifications_Order_By>>;
  where?: InputMaybe<Notifications_Bool_Exp>;
};

/** aggregated selection of "notification_permissions" */
export type Notification_Permissions_Aggregate = {
  __typename?: "notification_permissions_aggregate";
  aggregate?: Maybe<Notification_Permissions_Aggregate_Fields>;
  nodes: Array<Notification_Permissions>;
};

export type Notification_Permissions_Aggregate_Bool_Exp = {
  count?: InputMaybe<Notification_Permissions_Aggregate_Bool_Exp_Count>;
};

export type Notification_Permissions_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Notification_Permissions_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Notification_Permissions_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "notification_permissions" */
export type Notification_Permissions_Aggregate_Fields = {
  __typename?: "notification_permissions_aggregate_fields";
  avg?: Maybe<Notification_Permissions_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Notification_Permissions_Max_Fields>;
  min?: Maybe<Notification_Permissions_Min_Fields>;
  stddev?: Maybe<Notification_Permissions_Stddev_Fields>;
  stddev_pop?: Maybe<Notification_Permissions_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Notification_Permissions_Stddev_Samp_Fields>;
  sum?: Maybe<Notification_Permissions_Sum_Fields>;
  var_pop?: Maybe<Notification_Permissions_Var_Pop_Fields>;
  var_samp?: Maybe<Notification_Permissions_Var_Samp_Fields>;
  variance?: Maybe<Notification_Permissions_Variance_Fields>;
};

/** aggregate fields of "notification_permissions" */
export type Notification_Permissions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Notification_Permissions_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "notification_permissions" */
export type Notification_Permissions_Aggregate_Order_By = {
  avg?: InputMaybe<Notification_Permissions_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Notification_Permissions_Max_Order_By>;
  min?: InputMaybe<Notification_Permissions_Min_Order_By>;
  stddev?: InputMaybe<Notification_Permissions_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Notification_Permissions_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Notification_Permissions_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Notification_Permissions_Sum_Order_By>;
  var_pop?: InputMaybe<Notification_Permissions_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Notification_Permissions_Var_Samp_Order_By>;
  variance?: InputMaybe<Notification_Permissions_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Notification_Permissions_Append_Input = {
  /** Device information */
  device_info?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "notification_permissions" */
export type Notification_Permissions_Arr_Rel_Insert_Input = {
  data: Array<Notification_Permissions_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Notification_Permissions_On_Conflict>;
};

/** aggregate avg on columns */
export type Notification_Permissions_Avg_Fields = {
  __typename?: "notification_permissions_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "notification_permissions" */
export type Notification_Permissions_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "notification_permissions". All fields are combined with a logical 'AND'. */
export type Notification_Permissions_Bool_Exp = {
  _and?: InputMaybe<Array<Notification_Permissions_Bool_Exp>>;
  _not?: InputMaybe<Notification_Permissions_Bool_Exp>;
  _or?: InputMaybe<Array<Notification_Permissions_Bool_Exp>>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  device_info?: InputMaybe<Jsonb_Comparison_Exp>;
  device_token?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  notifications?: InputMaybe<Notifications_Bool_Exp>;
  notifications_aggregate?: InputMaybe<Notifications_Aggregate_Bool_Exp>;
  provider?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "notification_permissions" */
export enum Notification_Permissions_Constraint {
  /** unique or primary key constraint on columns "id" */
  NotificationPermissionsPkey = "notification_permissions_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Notification_Permissions_Delete_At_Path_Input = {
  /** Device information */
  device_info?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Notification_Permissions_Delete_Elem_Input = {
  /** Device information */
  device_info?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Notification_Permissions_Delete_Key_Input = {
  /** Device information */
  device_info?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "notification_permissions" */
export type Notification_Permissions_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "notification_permissions" */
export type Notification_Permissions_Insert_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Device information */
  device_info?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Device token for push notifications */
  device_token?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  notifications?: InputMaybe<Notifications_Arr_Rel_Insert_Input>;
  /** Notification provider (e.g., fcm, apns) */
  provider?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** Reference to users table */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Notification_Permissions_Max_Fields = {
  __typename?: "notification_permissions_max_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Device token for push notifications */
  device_token?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Notification provider (e.g., fcm, apns) */
  provider?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Reference to users table */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "notification_permissions" */
export type Notification_Permissions_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Device token for push notifications */
  device_token?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Notification provider (e.g., fcm, apns) */
  provider?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** Reference to users table */
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Notification_Permissions_Min_Fields = {
  __typename?: "notification_permissions_min_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Device token for push notifications */
  device_token?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Notification provider (e.g., fcm, apns) */
  provider?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Reference to users table */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "notification_permissions" */
export type Notification_Permissions_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Device token for push notifications */
  device_token?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Notification provider (e.g., fcm, apns) */
  provider?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** Reference to users table */
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "notification_permissions" */
export type Notification_Permissions_Mutation_Response = {
  __typename?: "notification_permissions_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Notification_Permissions>;
};

/** input type for inserting object relation for remote table "notification_permissions" */
export type Notification_Permissions_Obj_Rel_Insert_Input = {
  data: Notification_Permissions_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Notification_Permissions_On_Conflict>;
};

/** on_conflict condition type for table "notification_permissions" */
export type Notification_Permissions_On_Conflict = {
  constraint: Notification_Permissions_Constraint;
  update_columns?: Array<Notification_Permissions_Update_Column>;
  where?: InputMaybe<Notification_Permissions_Bool_Exp>;
};

/** Ordering options when selecting data from "notification_permissions". */
export type Notification_Permissions_Order_By = {
  created_at?: InputMaybe<Order_By>;
  device_info?: InputMaybe<Order_By>;
  device_token?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  notifications_aggregate?: InputMaybe<Notifications_Aggregate_Order_By>;
  provider?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: notification_permissions */
export type Notification_Permissions_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Notification_Permissions_Prepend_Input = {
  /** Device information */
  device_info?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "notification_permissions" */
export enum Notification_Permissions_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DeviceInfo = "device_info",
  /** column name */
  DeviceToken = "device_token",
  /** column name */
  Id = "id",
  /** column name */
  Provider = "provider",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "notification_permissions" */
export type Notification_Permissions_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Device information */
  device_info?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Device token for push notifications */
  device_token?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Notification provider (e.g., fcm, apns) */
  provider?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Reference to users table */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Notification_Permissions_Stddev_Fields = {
  __typename?: "notification_permissions_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "notification_permissions" */
export type Notification_Permissions_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Notification_Permissions_Stddev_Pop_Fields = {
  __typename?: "notification_permissions_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "notification_permissions" */
export type Notification_Permissions_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Notification_Permissions_Stddev_Samp_Fields = {
  __typename?: "notification_permissions_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "notification_permissions" */
export type Notification_Permissions_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "notification_permissions" */
export type Notification_Permissions_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Notification_Permissions_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Notification_Permissions_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Device information */
  device_info?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Device token for push notifications */
  device_token?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Notification provider (e.g., fcm, apns) */
  provider?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Reference to users table */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Notification_Permissions_Sum_Fields = {
  __typename?: "notification_permissions_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "notification_permissions" */
export type Notification_Permissions_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "notification_permissions" */
export enum Notification_Permissions_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DeviceInfo = "device_info",
  /** column name */
  DeviceToken = "device_token",
  /** column name */
  Id = "id",
  /** column name */
  Provider = "provider",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Notification_Permissions_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Notification_Permissions_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Notification_Permissions_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Notification_Permissions_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Notification_Permissions_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Notification_Permissions_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Notification_Permissions_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Notification_Permissions_Set_Input>;
  /** filter the rows which have to be updated */
  where: Notification_Permissions_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Notification_Permissions_Var_Pop_Fields = {
  __typename?: "notification_permissions_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "notification_permissions" */
export type Notification_Permissions_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Notification_Permissions_Var_Samp_Fields = {
  __typename?: "notification_permissions_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "notification_permissions" */
export type Notification_Permissions_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Notification_Permissions_Variance_Fields = {
  __typename?: "notification_permissions_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "notification_permissions" */
export type Notification_Permissions_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "notifications" */
export type Notifications = {
  __typename?: "notifications";
  /** Notification configuration */
  config?: Maybe<Scalars["jsonb"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** Error message if notification failed */
  error?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["uuid"]["output"];
  /** An object relationship */
  message: Notification_Messages;
  /** Reference to notification message */
  message_id: Scalars["uuid"]["output"];
  /** An object relationship */
  permission: Notification_Permissions;
  /** Reference to notification permission */
  permission_id: Scalars["uuid"]["output"];
  /** Notification status */
  status: Scalars["String"]["output"];
  updated_at: Scalars["bigint"]["output"];
};

/** columns and relationships of "notifications" */
export type NotificationsConfigArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "notifications" */
export type Notifications_Aggregate = {
  __typename?: "notifications_aggregate";
  aggregate?: Maybe<Notifications_Aggregate_Fields>;
  nodes: Array<Notifications>;
};

export type Notifications_Aggregate_Bool_Exp = {
  count?: InputMaybe<Notifications_Aggregate_Bool_Exp_Count>;
};

export type Notifications_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Notifications_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Notifications_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "notifications" */
export type Notifications_Aggregate_Fields = {
  __typename?: "notifications_aggregate_fields";
  avg?: Maybe<Notifications_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Notifications_Max_Fields>;
  min?: Maybe<Notifications_Min_Fields>;
  stddev?: Maybe<Notifications_Stddev_Fields>;
  stddev_pop?: Maybe<Notifications_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Notifications_Stddev_Samp_Fields>;
  sum?: Maybe<Notifications_Sum_Fields>;
  var_pop?: Maybe<Notifications_Var_Pop_Fields>;
  var_samp?: Maybe<Notifications_Var_Samp_Fields>;
  variance?: Maybe<Notifications_Variance_Fields>;
};

/** aggregate fields of "notifications" */
export type Notifications_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Notifications_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "notifications" */
export type Notifications_Aggregate_Order_By = {
  avg?: InputMaybe<Notifications_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Notifications_Max_Order_By>;
  min?: InputMaybe<Notifications_Min_Order_By>;
  stddev?: InputMaybe<Notifications_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Notifications_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Notifications_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Notifications_Sum_Order_By>;
  var_pop?: InputMaybe<Notifications_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Notifications_Var_Samp_Order_By>;
  variance?: InputMaybe<Notifications_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Notifications_Append_Input = {
  /** Notification configuration */
  config?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "notifications" */
export type Notifications_Arr_Rel_Insert_Input = {
  data: Array<Notifications_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Notifications_On_Conflict>;
};

/** aggregate avg on columns */
export type Notifications_Avg_Fields = {
  __typename?: "notifications_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "notifications" */
export type Notifications_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "notifications". All fields are combined with a logical 'AND'. */
export type Notifications_Bool_Exp = {
  _and?: InputMaybe<Array<Notifications_Bool_Exp>>;
  _not?: InputMaybe<Notifications_Bool_Exp>;
  _or?: InputMaybe<Array<Notifications_Bool_Exp>>;
  config?: InputMaybe<Jsonb_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  error?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  message?: InputMaybe<Notification_Messages_Bool_Exp>;
  message_id?: InputMaybe<Uuid_Comparison_Exp>;
  permission?: InputMaybe<Notification_Permissions_Bool_Exp>;
  permission_id?: InputMaybe<Uuid_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
};

/** unique or primary key constraints on table "notifications" */
export enum Notifications_Constraint {
  /** unique or primary key constraint on columns "id" */
  NotificationsPkey = "notifications_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Notifications_Delete_At_Path_Input = {
  /** Notification configuration */
  config?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Notifications_Delete_Elem_Input = {
  /** Notification configuration */
  config?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Notifications_Delete_Key_Input = {
  /** Notification configuration */
  config?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "notifications" */
export type Notifications_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "notifications" */
export type Notifications_Insert_Input = {
  /** Notification configuration */
  config?: InputMaybe<Scalars["jsonb"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Error message if notification failed */
  error?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  message?: InputMaybe<Notification_Messages_Obj_Rel_Insert_Input>;
  /** Reference to notification message */
  message_id?: InputMaybe<Scalars["uuid"]["input"]>;
  permission?: InputMaybe<Notification_Permissions_Obj_Rel_Insert_Input>;
  /** Reference to notification permission */
  permission_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Notification status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate max on columns */
export type Notifications_Max_Fields = {
  __typename?: "notifications_max_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Error message if notification failed */
  error?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Reference to notification message */
  message_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Reference to notification permission */
  permission_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Notification status */
  status?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by max() on columns of table "notifications" */
export type Notifications_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Error message if notification failed */
  error?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Reference to notification message */
  message_id?: InputMaybe<Order_By>;
  /** Reference to notification permission */
  permission_id?: InputMaybe<Order_By>;
  /** Notification status */
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Notifications_Min_Fields = {
  __typename?: "notifications_min_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Error message if notification failed */
  error?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Reference to notification message */
  message_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Reference to notification permission */
  permission_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Notification status */
  status?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by min() on columns of table "notifications" */
export type Notifications_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Error message if notification failed */
  error?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Reference to notification message */
  message_id?: InputMaybe<Order_By>;
  /** Reference to notification permission */
  permission_id?: InputMaybe<Order_By>;
  /** Notification status */
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "notifications" */
export type Notifications_Mutation_Response = {
  __typename?: "notifications_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Notifications>;
};

/** on_conflict condition type for table "notifications" */
export type Notifications_On_Conflict = {
  constraint: Notifications_Constraint;
  update_columns?: Array<Notifications_Update_Column>;
  where?: InputMaybe<Notifications_Bool_Exp>;
};

/** Ordering options when selecting data from "notifications". */
export type Notifications_Order_By = {
  config?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  message?: InputMaybe<Notification_Messages_Order_By>;
  message_id?: InputMaybe<Order_By>;
  permission?: InputMaybe<Notification_Permissions_Order_By>;
  permission_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: notifications */
export type Notifications_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Notifications_Prepend_Input = {
  /** Notification configuration */
  config?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "notifications" */
export enum Notifications_Select_Column {
  /** column name */
  Config = "config",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Error = "error",
  /** column name */
  Id = "id",
  /** column name */
  MessageId = "message_id",
  /** column name */
  PermissionId = "permission_id",
  /** column name */
  Status = "status",
  /** column name */
  UpdatedAt = "updated_at",
}

/** input type for updating data in table "notifications" */
export type Notifications_Set_Input = {
  /** Notification configuration */
  config?: InputMaybe<Scalars["jsonb"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Error message if notification failed */
  error?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to notification message */
  message_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to notification permission */
  permission_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Notification status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate stddev on columns */
export type Notifications_Stddev_Fields = {
  __typename?: "notifications_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "notifications" */
export type Notifications_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Notifications_Stddev_Pop_Fields = {
  __typename?: "notifications_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "notifications" */
export type Notifications_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Notifications_Stddev_Samp_Fields = {
  __typename?: "notifications_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "notifications" */
export type Notifications_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "notifications" */
export type Notifications_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Notifications_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Notifications_Stream_Cursor_Value_Input = {
  /** Notification configuration */
  config?: InputMaybe<Scalars["jsonb"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Error message if notification failed */
  error?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to notification message */
  message_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Reference to notification permission */
  permission_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Notification status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate sum on columns */
export type Notifications_Sum_Fields = {
  __typename?: "notifications_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "notifications" */
export type Notifications_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "notifications" */
export enum Notifications_Update_Column {
  /** column name */
  Config = "config",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Error = "error",
  /** column name */
  Id = "id",
  /** column name */
  MessageId = "message_id",
  /** column name */
  PermissionId = "permission_id",
  /** column name */
  Status = "status",
  /** column name */
  UpdatedAt = "updated_at",
}

export type Notifications_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Notifications_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Notifications_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Notifications_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Notifications_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Notifications_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Notifications_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Notifications_Set_Input>;
  /** filter the rows which have to be updated */
  where: Notifications_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Notifications_Var_Pop_Fields = {
  __typename?: "notifications_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "notifications" */
export type Notifications_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Notifications_Var_Samp_Fields = {
  __typename?: "notifications_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "notifications" */
export type Notifications_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Notifications_Variance_Fields = {
  __typename?: "notifications_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "notifications" */
export type Notifications_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["numeric"]["input"]>;
  _gt?: InputMaybe<Scalars["numeric"]["input"]>;
  _gte?: InputMaybe<Scalars["numeric"]["input"]>;
  _in?: InputMaybe<Array<Scalars["numeric"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["numeric"]["input"]>;
  _lte?: InputMaybe<Scalars["numeric"]["input"]>;
  _neq?: InputMaybe<Scalars["numeric"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["numeric"]["input"]>>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = "asc",
  /** in ascending order, nulls first */
  AscNullsFirst = "asc_nulls_first",
  /** in ascending order, nulls last */
  AscNullsLast = "asc_nulls_last",
  /** in descending order, nulls first */
  Desc = "desc",
  /** in descending order, nulls first */
  DescNullsFirst = "desc_nulls_first",
  /** in descending order, nulls last */
  DescNullsLast = "desc_nulls_last",
}

/** columns and relationships of "payments.methods" */
export type Payments_Methods = {
  __typename?: "payments_methods";
  created_at: Scalars["bigint"]["output"];
  /** Payment method details */
  details?: Maybe<Scalars["jsonb"]["output"]>;
  /** Expiration timestamp */
  expires_at?: Maybe<Scalars["bigint"]["output"]>;
  /** External provider ID */
  external_id?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["uuid"]["output"];
  /** Default method flag */
  is_default?: Maybe<Scalars["Boolean"]["output"]>;
  /** Recurrent payment ready */
  is_recurrent_ready?: Maybe<Scalars["Boolean"]["output"]>;
  /** An array relationship */
  operations: Array<Payments_Operations>;
  /** An aggregate relationship */
  operations_aggregate: Payments_Operations_Aggregate;
  /** An object relationship */
  provider: Payments_Providers;
  /** Provider ID */
  provider_id: Scalars["uuid"]["output"];
  /** Recurrent payment details */
  recurrent_details?: Maybe<Scalars["jsonb"]["output"]>;
  /** Method status */
  status?: Maybe<Scalars["String"]["output"]>;
  /** An array relationship */
  subscriptions: Array<Payments_Subscriptions>;
  /** An aggregate relationship */
  subscriptions_aggregate: Payments_Subscriptions_Aggregate;
  /** Payment method type */
  type: Scalars["String"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user: Users;
  /** User ID */
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "payments.methods" */
export type Payments_MethodsDetailsArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "payments.methods" */
export type Payments_MethodsOperationsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Operations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Operations_Order_By>>;
  where?: InputMaybe<Payments_Operations_Bool_Exp>;
};

/** columns and relationships of "payments.methods" */
export type Payments_MethodsOperations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Operations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Operations_Order_By>>;
  where?: InputMaybe<Payments_Operations_Bool_Exp>;
};

/** columns and relationships of "payments.methods" */
export type Payments_MethodsRecurrent_DetailsArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "payments.methods" */
export type Payments_MethodsSubscriptionsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Subscriptions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Subscriptions_Order_By>>;
  where?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
};

/** columns and relationships of "payments.methods" */
export type Payments_MethodsSubscriptions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Subscriptions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Subscriptions_Order_By>>;
  where?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
};

/** aggregated selection of "payments.methods" */
export type Payments_Methods_Aggregate = {
  __typename?: "payments_methods_aggregate";
  aggregate?: Maybe<Payments_Methods_Aggregate_Fields>;
  nodes: Array<Payments_Methods>;
};

export type Payments_Methods_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Payments_Methods_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Payments_Methods_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Payments_Methods_Aggregate_Bool_Exp_Count>;
};

export type Payments_Methods_Aggregate_Bool_Exp_Bool_And = {
  arguments: Payments_Methods_Select_Column_Payments_Methods_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Payments_Methods_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Payments_Methods_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Payments_Methods_Select_Column_Payments_Methods_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Payments_Methods_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Payments_Methods_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Payments_Methods_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Payments_Methods_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "payments.methods" */
export type Payments_Methods_Aggregate_Fields = {
  __typename?: "payments_methods_aggregate_fields";
  avg?: Maybe<Payments_Methods_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Payments_Methods_Max_Fields>;
  min?: Maybe<Payments_Methods_Min_Fields>;
  stddev?: Maybe<Payments_Methods_Stddev_Fields>;
  stddev_pop?: Maybe<Payments_Methods_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Payments_Methods_Stddev_Samp_Fields>;
  sum?: Maybe<Payments_Methods_Sum_Fields>;
  var_pop?: Maybe<Payments_Methods_Var_Pop_Fields>;
  var_samp?: Maybe<Payments_Methods_Var_Samp_Fields>;
  variance?: Maybe<Payments_Methods_Variance_Fields>;
};

/** aggregate fields of "payments.methods" */
export type Payments_Methods_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Payments_Methods_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "payments.methods" */
export type Payments_Methods_Aggregate_Order_By = {
  avg?: InputMaybe<Payments_Methods_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Payments_Methods_Max_Order_By>;
  min?: InputMaybe<Payments_Methods_Min_Order_By>;
  stddev?: InputMaybe<Payments_Methods_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Payments_Methods_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Payments_Methods_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Payments_Methods_Sum_Order_By>;
  var_pop?: InputMaybe<Payments_Methods_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Payments_Methods_Var_Samp_Order_By>;
  variance?: InputMaybe<Payments_Methods_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Payments_Methods_Append_Input = {
  /** Payment method details */
  details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Recurrent payment details */
  recurrent_details?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "payments.methods" */
export type Payments_Methods_Arr_Rel_Insert_Input = {
  data: Array<Payments_Methods_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Payments_Methods_On_Conflict>;
};

/** aggregate avg on columns */
export type Payments_Methods_Avg_Fields = {
  __typename?: "payments_methods_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "payments.methods" */
export type Payments_Methods_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "payments.methods". All fields are combined with a logical 'AND'. */
export type Payments_Methods_Bool_Exp = {
  _and?: InputMaybe<Array<Payments_Methods_Bool_Exp>>;
  _not?: InputMaybe<Payments_Methods_Bool_Exp>;
  _or?: InputMaybe<Array<Payments_Methods_Bool_Exp>>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  details?: InputMaybe<Jsonb_Comparison_Exp>;
  expires_at?: InputMaybe<Bigint_Comparison_Exp>;
  external_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_default?: InputMaybe<Boolean_Comparison_Exp>;
  is_recurrent_ready?: InputMaybe<Boolean_Comparison_Exp>;
  operations?: InputMaybe<Payments_Operations_Bool_Exp>;
  operations_aggregate?: InputMaybe<Payments_Operations_Aggregate_Bool_Exp>;
  provider?: InputMaybe<Payments_Providers_Bool_Exp>;
  provider_id?: InputMaybe<Uuid_Comparison_Exp>;
  recurrent_details?: InputMaybe<Jsonb_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  subscriptions?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
  subscriptions_aggregate?: InputMaybe<Payments_Subscriptions_Aggregate_Bool_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "payments.methods" */
export enum Payments_Methods_Constraint {
  /** unique or primary key constraint on columns "id" */
  MethodsPkey = "methods_pkey",
  /** unique or primary key constraint on columns "user_id", "type", "external_id", "provider_id" */
  MethodsUserProviderExternalTypeUnique = "methods_user_provider_external_type_unique",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Payments_Methods_Delete_At_Path_Input = {
  /** Payment method details */
  details?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Recurrent payment details */
  recurrent_details?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Payments_Methods_Delete_Elem_Input = {
  /** Payment method details */
  details?: InputMaybe<Scalars["Int"]["input"]>;
  /** Recurrent payment details */
  recurrent_details?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Payments_Methods_Delete_Key_Input = {
  /** Payment method details */
  details?: InputMaybe<Scalars["String"]["input"]>;
  /** Recurrent payment details */
  recurrent_details?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "payments.methods" */
export type Payments_Methods_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "payments.methods" */
export type Payments_Methods_Insert_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Payment method details */
  details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** External provider ID */
  external_id?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Default method flag */
  is_default?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Recurrent payment ready */
  is_recurrent_ready?: InputMaybe<Scalars["Boolean"]["input"]>;
  operations?: InputMaybe<Payments_Operations_Arr_Rel_Insert_Input>;
  provider?: InputMaybe<Payments_Providers_Obj_Rel_Insert_Input>;
  /** Provider ID */
  provider_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Recurrent payment details */
  recurrent_details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Method status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  subscriptions?: InputMaybe<Payments_Subscriptions_Arr_Rel_Insert_Input>;
  /** Payment method type */
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** User ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Payments_Methods_Max_Fields = {
  __typename?: "payments_methods_max_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Expiration timestamp */
  expires_at?: Maybe<Scalars["bigint"]["output"]>;
  /** External provider ID */
  external_id?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Provider ID */
  provider_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Method status */
  status?: Maybe<Scalars["String"]["output"]>;
  /** Payment method type */
  type?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "payments.methods" */
export type Payments_Methods_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  /** External provider ID */
  external_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Provider ID */
  provider_id?: InputMaybe<Order_By>;
  /** Method status */
  status?: InputMaybe<Order_By>;
  /** Payment method type */
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** User ID */
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Payments_Methods_Min_Fields = {
  __typename?: "payments_methods_min_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Expiration timestamp */
  expires_at?: Maybe<Scalars["bigint"]["output"]>;
  /** External provider ID */
  external_id?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Provider ID */
  provider_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Method status */
  status?: Maybe<Scalars["String"]["output"]>;
  /** Payment method type */
  type?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "payments.methods" */
export type Payments_Methods_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  /** External provider ID */
  external_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Provider ID */
  provider_id?: InputMaybe<Order_By>;
  /** Method status */
  status?: InputMaybe<Order_By>;
  /** Payment method type */
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** User ID */
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "payments.methods" */
export type Payments_Methods_Mutation_Response = {
  __typename?: "payments_methods_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Payments_Methods>;
};

/** input type for inserting object relation for remote table "payments.methods" */
export type Payments_Methods_Obj_Rel_Insert_Input = {
  data: Payments_Methods_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Payments_Methods_On_Conflict>;
};

/** on_conflict condition type for table "payments.methods" */
export type Payments_Methods_On_Conflict = {
  constraint: Payments_Methods_Constraint;
  update_columns?: Array<Payments_Methods_Update_Column>;
  where?: InputMaybe<Payments_Methods_Bool_Exp>;
};

/** Ordering options when selecting data from "payments.methods". */
export type Payments_Methods_Order_By = {
  created_at?: InputMaybe<Order_By>;
  details?: InputMaybe<Order_By>;
  expires_at?: InputMaybe<Order_By>;
  external_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_default?: InputMaybe<Order_By>;
  is_recurrent_ready?: InputMaybe<Order_By>;
  operations_aggregate?: InputMaybe<Payments_Operations_Aggregate_Order_By>;
  provider?: InputMaybe<Payments_Providers_Order_By>;
  provider_id?: InputMaybe<Order_By>;
  recurrent_details?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  subscriptions_aggregate?: InputMaybe<Payments_Subscriptions_Aggregate_Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: payments.methods */
export type Payments_Methods_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Payments_Methods_Prepend_Input = {
  /** Payment method details */
  details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Recurrent payment details */
  recurrent_details?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "payments.methods" */
export enum Payments_Methods_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Details = "details",
  /** column name */
  ExpiresAt = "expires_at",
  /** column name */
  ExternalId = "external_id",
  /** column name */
  Id = "id",
  /** column name */
  IsDefault = "is_default",
  /** column name */
  IsRecurrentReady = "is_recurrent_ready",
  /** column name */
  ProviderId = "provider_id",
  /** column name */
  RecurrentDetails = "recurrent_details",
  /** column name */
  Status = "status",
  /** column name */
  Type = "type",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** select "payments_methods_aggregate_bool_exp_bool_and_arguments_columns" columns of table "payments.methods" */
export enum Payments_Methods_Select_Column_Payments_Methods_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsDefault = "is_default",
  /** column name */
  IsRecurrentReady = "is_recurrent_ready",
}

/** select "payments_methods_aggregate_bool_exp_bool_or_arguments_columns" columns of table "payments.methods" */
export enum Payments_Methods_Select_Column_Payments_Methods_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsDefault = "is_default",
  /** column name */
  IsRecurrentReady = "is_recurrent_ready",
}

/** input type for updating data in table "payments.methods" */
export type Payments_Methods_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Payment method details */
  details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** External provider ID */
  external_id?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Default method flag */
  is_default?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Recurrent payment ready */
  is_recurrent_ready?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Provider ID */
  provider_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Recurrent payment details */
  recurrent_details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Method status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  /** Payment method type */
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Payments_Methods_Stddev_Fields = {
  __typename?: "payments_methods_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "payments.methods" */
export type Payments_Methods_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Payments_Methods_Stddev_Pop_Fields = {
  __typename?: "payments_methods_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "payments.methods" */
export type Payments_Methods_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Payments_Methods_Stddev_Samp_Fields = {
  __typename?: "payments_methods_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "payments.methods" */
export type Payments_Methods_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "payments_methods" */
export type Payments_Methods_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Payments_Methods_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Payments_Methods_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Payment method details */
  details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** External provider ID */
  external_id?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Default method flag */
  is_default?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Recurrent payment ready */
  is_recurrent_ready?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Provider ID */
  provider_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Recurrent payment details */
  recurrent_details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Method status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  /** Payment method type */
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Payments_Methods_Sum_Fields = {
  __typename?: "payments_methods_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Expiration timestamp */
  expires_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "payments.methods" */
export type Payments_Methods_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "payments.methods" */
export enum Payments_Methods_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Details = "details",
  /** column name */
  ExpiresAt = "expires_at",
  /** column name */
  ExternalId = "external_id",
  /** column name */
  Id = "id",
  /** column name */
  IsDefault = "is_default",
  /** column name */
  IsRecurrentReady = "is_recurrent_ready",
  /** column name */
  ProviderId = "provider_id",
  /** column name */
  RecurrentDetails = "recurrent_details",
  /** column name */
  Status = "status",
  /** column name */
  Type = "type",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Payments_Methods_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Payments_Methods_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Payments_Methods_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Payments_Methods_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Payments_Methods_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Payments_Methods_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Payments_Methods_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Payments_Methods_Set_Input>;
  /** filter the rows which have to be updated */
  where: Payments_Methods_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Payments_Methods_Var_Pop_Fields = {
  __typename?: "payments_methods_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "payments.methods" */
export type Payments_Methods_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Payments_Methods_Var_Samp_Fields = {
  __typename?: "payments_methods_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "payments.methods" */
export type Payments_Methods_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Payments_Methods_Variance_Fields = {
  __typename?: "payments_methods_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Expiration timestamp */
  expires_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "payments.methods" */
export type Payments_Methods_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Expiration timestamp */
  expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "payments.operations" */
export type Payments_Operations = {
  __typename?: "payments_operations";
  /** Operation amount */
  amount: Scalars["numeric"]["output"];
  created_at: Scalars["bigint"]["output"];
  /** Currency code */
  currency: Scalars["String"]["output"];
  /** Operation description */
  description?: Maybe<Scalars["String"]["output"]>;
  /** Error message */
  error_message?: Maybe<Scalars["String"]["output"]>;
  /** External operation ID */
  external_operation_id?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["uuid"]["output"];
  /** Initiation timestamp */
  initiated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Operation metadata */
  metadata?: Maybe<Scalars["jsonb"]["output"]>;
  /** An object relationship */
  method?: Maybe<Payments_Methods>;
  /** Payment method ID */
  method_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Object HID */
  object_hid?: Maybe<Scalars["String"]["output"]>;
  /** Payment timestamp */
  paid_at?: Maybe<Scalars["bigint"]["output"]>;
  /** An object relationship */
  provider: Payments_Providers;
  /** Provider ID */
  provider_id: Scalars["uuid"]["output"];
  /** Provider request details */
  provider_request_details?: Maybe<Scalars["jsonb"]["output"]>;
  /** Provider response details */
  provider_response_details?: Maybe<Scalars["jsonb"]["output"]>;
  /** Operation status */
  status: Scalars["String"]["output"];
  /** An object relationship */
  subscription?: Maybe<Payments_Subscriptions>;
  /** Subscription ID */
  subscription_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user: Users;
  /** User ID */
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "payments.operations" */
export type Payments_OperationsMetadataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "payments.operations" */
export type Payments_OperationsProvider_Request_DetailsArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "payments.operations" */
export type Payments_OperationsProvider_Response_DetailsArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "payments.operations" */
export type Payments_Operations_Aggregate = {
  __typename?: "payments_operations_aggregate";
  aggregate?: Maybe<Payments_Operations_Aggregate_Fields>;
  nodes: Array<Payments_Operations>;
};

export type Payments_Operations_Aggregate_Bool_Exp = {
  count?: InputMaybe<Payments_Operations_Aggregate_Bool_Exp_Count>;
};

export type Payments_Operations_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Payments_Operations_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Payments_Operations_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "payments.operations" */
export type Payments_Operations_Aggregate_Fields = {
  __typename?: "payments_operations_aggregate_fields";
  avg?: Maybe<Payments_Operations_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Payments_Operations_Max_Fields>;
  min?: Maybe<Payments_Operations_Min_Fields>;
  stddev?: Maybe<Payments_Operations_Stddev_Fields>;
  stddev_pop?: Maybe<Payments_Operations_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Payments_Operations_Stddev_Samp_Fields>;
  sum?: Maybe<Payments_Operations_Sum_Fields>;
  var_pop?: Maybe<Payments_Operations_Var_Pop_Fields>;
  var_samp?: Maybe<Payments_Operations_Var_Samp_Fields>;
  variance?: Maybe<Payments_Operations_Variance_Fields>;
};

/** aggregate fields of "payments.operations" */
export type Payments_Operations_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Payments_Operations_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "payments.operations" */
export type Payments_Operations_Aggregate_Order_By = {
  avg?: InputMaybe<Payments_Operations_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Payments_Operations_Max_Order_By>;
  min?: InputMaybe<Payments_Operations_Min_Order_By>;
  stddev?: InputMaybe<Payments_Operations_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Payments_Operations_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Payments_Operations_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Payments_Operations_Sum_Order_By>;
  var_pop?: InputMaybe<Payments_Operations_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Payments_Operations_Var_Samp_Order_By>;
  variance?: InputMaybe<Payments_Operations_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Payments_Operations_Append_Input = {
  /** Operation metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Provider request details */
  provider_request_details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Provider response details */
  provider_response_details?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "payments.operations" */
export type Payments_Operations_Arr_Rel_Insert_Input = {
  data: Array<Payments_Operations_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Payments_Operations_On_Conflict>;
};

/** aggregate avg on columns */
export type Payments_Operations_Avg_Fields = {
  __typename?: "payments_operations_avg_fields";
  /** Operation amount */
  amount?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Initiation timestamp */
  initiated_at?: Maybe<Scalars["Float"]["output"]>;
  /** Payment timestamp */
  paid_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "payments.operations" */
export type Payments_Operations_Avg_Order_By = {
  /** Operation amount */
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Order_By>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "payments.operations". All fields are combined with a logical 'AND'. */
export type Payments_Operations_Bool_Exp = {
  _and?: InputMaybe<Array<Payments_Operations_Bool_Exp>>;
  _not?: InputMaybe<Payments_Operations_Bool_Exp>;
  _or?: InputMaybe<Array<Payments_Operations_Bool_Exp>>;
  amount?: InputMaybe<Numeric_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  currency?: InputMaybe<String_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  error_message?: InputMaybe<String_Comparison_Exp>;
  external_operation_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  initiated_at?: InputMaybe<Bigint_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  method?: InputMaybe<Payments_Methods_Bool_Exp>;
  method_id?: InputMaybe<Uuid_Comparison_Exp>;
  object_hid?: InputMaybe<String_Comparison_Exp>;
  paid_at?: InputMaybe<Bigint_Comparison_Exp>;
  provider?: InputMaybe<Payments_Providers_Bool_Exp>;
  provider_id?: InputMaybe<Uuid_Comparison_Exp>;
  provider_request_details?: InputMaybe<Jsonb_Comparison_Exp>;
  provider_response_details?: InputMaybe<Jsonb_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  subscription?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
  subscription_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "payments.operations" */
export enum Payments_Operations_Constraint {
  /** unique or primary key constraint on columns "id" */
  OperationsPkey = "operations_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Payments_Operations_Delete_At_Path_Input = {
  /** Operation metadata */
  metadata?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Provider request details */
  provider_request_details?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Provider response details */
  provider_response_details?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Payments_Operations_Delete_Elem_Input = {
  /** Operation metadata */
  metadata?: InputMaybe<Scalars["Int"]["input"]>;
  /** Provider request details */
  provider_request_details?: InputMaybe<Scalars["Int"]["input"]>;
  /** Provider response details */
  provider_response_details?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Payments_Operations_Delete_Key_Input = {
  /** Operation metadata */
  metadata?: InputMaybe<Scalars["String"]["input"]>;
  /** Provider request details */
  provider_request_details?: InputMaybe<Scalars["String"]["input"]>;
  /** Provider response details */
  provider_response_details?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "payments.operations" */
export type Payments_Operations_Inc_Input = {
  /** Operation amount */
  amount?: InputMaybe<Scalars["numeric"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "payments.operations" */
export type Payments_Operations_Insert_Input = {
  /** Operation amount */
  amount?: InputMaybe<Scalars["numeric"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Currency code */
  currency?: InputMaybe<Scalars["String"]["input"]>;
  /** Operation description */
  description?: InputMaybe<Scalars["String"]["input"]>;
  /** Error message */
  error_message?: InputMaybe<Scalars["String"]["input"]>;
  /** External operation ID */
  external_operation_id?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Operation metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  method?: InputMaybe<Payments_Methods_Obj_Rel_Insert_Input>;
  /** Payment method ID */
  method_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Object HID */
  object_hid?: InputMaybe<Scalars["String"]["input"]>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Scalars["bigint"]["input"]>;
  provider?: InputMaybe<Payments_Providers_Obj_Rel_Insert_Input>;
  /** Provider ID */
  provider_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Provider request details */
  provider_request_details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Provider response details */
  provider_response_details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Operation status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  subscription?: InputMaybe<Payments_Subscriptions_Obj_Rel_Insert_Input>;
  /** Subscription ID */
  subscription_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** User ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Payments_Operations_Max_Fields = {
  __typename?: "payments_operations_max_fields";
  /** Operation amount */
  amount?: Maybe<Scalars["numeric"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Currency code */
  currency?: Maybe<Scalars["String"]["output"]>;
  /** Operation description */
  description?: Maybe<Scalars["String"]["output"]>;
  /** Error message */
  error_message?: Maybe<Scalars["String"]["output"]>;
  /** External operation ID */
  external_operation_id?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Initiation timestamp */
  initiated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Payment method ID */
  method_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Object HID */
  object_hid?: Maybe<Scalars["String"]["output"]>;
  /** Payment timestamp */
  paid_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Provider ID */
  provider_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Operation status */
  status?: Maybe<Scalars["String"]["output"]>;
  /** Subscription ID */
  subscription_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "payments.operations" */
export type Payments_Operations_Max_Order_By = {
  /** Operation amount */
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Currency code */
  currency?: InputMaybe<Order_By>;
  /** Operation description */
  description?: InputMaybe<Order_By>;
  /** Error message */
  error_message?: InputMaybe<Order_By>;
  /** External operation ID */
  external_operation_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Order_By>;
  /** Payment method ID */
  method_id?: InputMaybe<Order_By>;
  /** Object HID */
  object_hid?: InputMaybe<Order_By>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Order_By>;
  /** Provider ID */
  provider_id?: InputMaybe<Order_By>;
  /** Operation status */
  status?: InputMaybe<Order_By>;
  /** Subscription ID */
  subscription_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** User ID */
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Payments_Operations_Min_Fields = {
  __typename?: "payments_operations_min_fields";
  /** Operation amount */
  amount?: Maybe<Scalars["numeric"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Currency code */
  currency?: Maybe<Scalars["String"]["output"]>;
  /** Operation description */
  description?: Maybe<Scalars["String"]["output"]>;
  /** Error message */
  error_message?: Maybe<Scalars["String"]["output"]>;
  /** External operation ID */
  external_operation_id?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Initiation timestamp */
  initiated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Payment method ID */
  method_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Object HID */
  object_hid?: Maybe<Scalars["String"]["output"]>;
  /** Payment timestamp */
  paid_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Provider ID */
  provider_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Operation status */
  status?: Maybe<Scalars["String"]["output"]>;
  /** Subscription ID */
  subscription_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "payments.operations" */
export type Payments_Operations_Min_Order_By = {
  /** Operation amount */
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Currency code */
  currency?: InputMaybe<Order_By>;
  /** Operation description */
  description?: InputMaybe<Order_By>;
  /** Error message */
  error_message?: InputMaybe<Order_By>;
  /** External operation ID */
  external_operation_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Order_By>;
  /** Payment method ID */
  method_id?: InputMaybe<Order_By>;
  /** Object HID */
  object_hid?: InputMaybe<Order_By>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Order_By>;
  /** Provider ID */
  provider_id?: InputMaybe<Order_By>;
  /** Operation status */
  status?: InputMaybe<Order_By>;
  /** Subscription ID */
  subscription_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** User ID */
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "payments.operations" */
export type Payments_Operations_Mutation_Response = {
  __typename?: "payments_operations_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Payments_Operations>;
};

/** on_conflict condition type for table "payments.operations" */
export type Payments_Operations_On_Conflict = {
  constraint: Payments_Operations_Constraint;
  update_columns?: Array<Payments_Operations_Update_Column>;
  where?: InputMaybe<Payments_Operations_Bool_Exp>;
};

/** Ordering options when selecting data from "payments.operations". */
export type Payments_Operations_Order_By = {
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  currency?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  error_message?: InputMaybe<Order_By>;
  external_operation_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  initiated_at?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  method?: InputMaybe<Payments_Methods_Order_By>;
  method_id?: InputMaybe<Order_By>;
  object_hid?: InputMaybe<Order_By>;
  paid_at?: InputMaybe<Order_By>;
  provider?: InputMaybe<Payments_Providers_Order_By>;
  provider_id?: InputMaybe<Order_By>;
  provider_request_details?: InputMaybe<Order_By>;
  provider_response_details?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  subscription?: InputMaybe<Payments_Subscriptions_Order_By>;
  subscription_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: payments.operations */
export type Payments_Operations_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Payments_Operations_Prepend_Input = {
  /** Operation metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Provider request details */
  provider_request_details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Provider response details */
  provider_response_details?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "payments.operations" */
export enum Payments_Operations_Select_Column {
  /** column name */
  Amount = "amount",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Currency = "currency",
  /** column name */
  Description = "description",
  /** column name */
  ErrorMessage = "error_message",
  /** column name */
  ExternalOperationId = "external_operation_id",
  /** column name */
  Id = "id",
  /** column name */
  InitiatedAt = "initiated_at",
  /** column name */
  Metadata = "metadata",
  /** column name */
  MethodId = "method_id",
  /** column name */
  ObjectHid = "object_hid",
  /** column name */
  PaidAt = "paid_at",
  /** column name */
  ProviderId = "provider_id",
  /** column name */
  ProviderRequestDetails = "provider_request_details",
  /** column name */
  ProviderResponseDetails = "provider_response_details",
  /** column name */
  Status = "status",
  /** column name */
  SubscriptionId = "subscription_id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "payments.operations" */
export type Payments_Operations_Set_Input = {
  /** Operation amount */
  amount?: InputMaybe<Scalars["numeric"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Currency code */
  currency?: InputMaybe<Scalars["String"]["input"]>;
  /** Operation description */
  description?: InputMaybe<Scalars["String"]["input"]>;
  /** Error message */
  error_message?: InputMaybe<Scalars["String"]["input"]>;
  /** External operation ID */
  external_operation_id?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Operation metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Payment method ID */
  method_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Object HID */
  object_hid?: InputMaybe<Scalars["String"]["input"]>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Provider ID */
  provider_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Provider request details */
  provider_request_details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Provider response details */
  provider_response_details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Operation status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  /** Subscription ID */
  subscription_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Payments_Operations_Stddev_Fields = {
  __typename?: "payments_operations_stddev_fields";
  /** Operation amount */
  amount?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Initiation timestamp */
  initiated_at?: Maybe<Scalars["Float"]["output"]>;
  /** Payment timestamp */
  paid_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "payments.operations" */
export type Payments_Operations_Stddev_Order_By = {
  /** Operation amount */
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Order_By>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Payments_Operations_Stddev_Pop_Fields = {
  __typename?: "payments_operations_stddev_pop_fields";
  /** Operation amount */
  amount?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Initiation timestamp */
  initiated_at?: Maybe<Scalars["Float"]["output"]>;
  /** Payment timestamp */
  paid_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "payments.operations" */
export type Payments_Operations_Stddev_Pop_Order_By = {
  /** Operation amount */
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Order_By>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Payments_Operations_Stddev_Samp_Fields = {
  __typename?: "payments_operations_stddev_samp_fields";
  /** Operation amount */
  amount?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Initiation timestamp */
  initiated_at?: Maybe<Scalars["Float"]["output"]>;
  /** Payment timestamp */
  paid_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "payments.operations" */
export type Payments_Operations_Stddev_Samp_Order_By = {
  /** Operation amount */
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Order_By>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "payments_operations" */
export type Payments_Operations_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Payments_Operations_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Payments_Operations_Stream_Cursor_Value_Input = {
  /** Operation amount */
  amount?: InputMaybe<Scalars["numeric"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Currency code */
  currency?: InputMaybe<Scalars["String"]["input"]>;
  /** Operation description */
  description?: InputMaybe<Scalars["String"]["input"]>;
  /** Error message */
  error_message?: InputMaybe<Scalars["String"]["input"]>;
  /** External operation ID */
  external_operation_id?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Operation metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Payment method ID */
  method_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Object HID */
  object_hid?: InputMaybe<Scalars["String"]["input"]>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Provider ID */
  provider_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Provider request details */
  provider_request_details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Provider response details */
  provider_response_details?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Operation status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  /** Subscription ID */
  subscription_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Payments_Operations_Sum_Fields = {
  __typename?: "payments_operations_sum_fields";
  /** Operation amount */
  amount?: Maybe<Scalars["numeric"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Initiation timestamp */
  initiated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Payment timestamp */
  paid_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "payments.operations" */
export type Payments_Operations_Sum_Order_By = {
  /** Operation amount */
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Order_By>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "payments.operations" */
export enum Payments_Operations_Update_Column {
  /** column name */
  Amount = "amount",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Currency = "currency",
  /** column name */
  Description = "description",
  /** column name */
  ErrorMessage = "error_message",
  /** column name */
  ExternalOperationId = "external_operation_id",
  /** column name */
  Id = "id",
  /** column name */
  InitiatedAt = "initiated_at",
  /** column name */
  Metadata = "metadata",
  /** column name */
  MethodId = "method_id",
  /** column name */
  ObjectHid = "object_hid",
  /** column name */
  PaidAt = "paid_at",
  /** column name */
  ProviderId = "provider_id",
  /** column name */
  ProviderRequestDetails = "provider_request_details",
  /** column name */
  ProviderResponseDetails = "provider_response_details",
  /** column name */
  Status = "status",
  /** column name */
  SubscriptionId = "subscription_id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Payments_Operations_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Payments_Operations_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Payments_Operations_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Payments_Operations_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Payments_Operations_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Payments_Operations_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Payments_Operations_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Payments_Operations_Set_Input>;
  /** filter the rows which have to be updated */
  where: Payments_Operations_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Payments_Operations_Var_Pop_Fields = {
  __typename?: "payments_operations_var_pop_fields";
  /** Operation amount */
  amount?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Initiation timestamp */
  initiated_at?: Maybe<Scalars["Float"]["output"]>;
  /** Payment timestamp */
  paid_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "payments.operations" */
export type Payments_Operations_Var_Pop_Order_By = {
  /** Operation amount */
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Order_By>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Payments_Operations_Var_Samp_Fields = {
  __typename?: "payments_operations_var_samp_fields";
  /** Operation amount */
  amount?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Initiation timestamp */
  initiated_at?: Maybe<Scalars["Float"]["output"]>;
  /** Payment timestamp */
  paid_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "payments.operations" */
export type Payments_Operations_Var_Samp_Order_By = {
  /** Operation amount */
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Order_By>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Payments_Operations_Variance_Fields = {
  __typename?: "payments_operations_variance_fields";
  /** Operation amount */
  amount?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Initiation timestamp */
  initiated_at?: Maybe<Scalars["Float"]["output"]>;
  /** Payment timestamp */
  paid_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "payments.operations" */
export type Payments_Operations_Variance_Order_By = {
  /** Operation amount */
  amount?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Initiation timestamp */
  initiated_at?: InputMaybe<Order_By>;
  /** Payment timestamp */
  paid_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "payments.plans" */
export type Payments_Plans = {
  __typename?: "payments_plans";
  /** Plan active status */
  active?: Maybe<Scalars["Boolean"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** Currency code */
  currency: Scalars["String"]["output"];
  /** Plan description */
  description?: Maybe<Scalars["String"]["output"]>;
  /** Plan features */
  features?: Maybe<Scalars["jsonb"]["output"]>;
  id: Scalars["uuid"]["output"];
  /** Billing interval: "minute", "hour", "day", "week", "month", "year" */
  interval: Scalars["String"]["output"];
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count: Scalars["Int"]["output"];
  /** Plan metadata */
  metadata?: Maybe<Scalars["jsonb"]["output"]>;
  /** Plan name */
  name: Scalars["String"]["output"];
  /** Plan price */
  price: Scalars["numeric"]["output"];
  /** An array relationship */
  subscriptions: Array<Payments_Subscriptions>;
  /** An aggregate relationship */
  subscriptions_aggregate: Payments_Subscriptions_Aggregate;
  /** Trial period in days */
  trial_period_days?: Maybe<Scalars["Int"]["output"]>;
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user?: Maybe<Users>;
  /** Plan creator user ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** columns and relationships of "payments.plans" */
export type Payments_PlansFeaturesArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "payments.plans" */
export type Payments_PlansMetadataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "payments.plans" */
export type Payments_PlansSubscriptionsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Subscriptions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Subscriptions_Order_By>>;
  where?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
};

/** columns and relationships of "payments.plans" */
export type Payments_PlansSubscriptions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Subscriptions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Subscriptions_Order_By>>;
  where?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
};

/** aggregated selection of "payments.plans" */
export type Payments_Plans_Aggregate = {
  __typename?: "payments_plans_aggregate";
  aggregate?: Maybe<Payments_Plans_Aggregate_Fields>;
  nodes: Array<Payments_Plans>;
};

export type Payments_Plans_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Payments_Plans_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Payments_Plans_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Payments_Plans_Aggregate_Bool_Exp_Count>;
};

export type Payments_Plans_Aggregate_Bool_Exp_Bool_And = {
  arguments: Payments_Plans_Select_Column_Payments_Plans_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Payments_Plans_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Payments_Plans_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Payments_Plans_Select_Column_Payments_Plans_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Payments_Plans_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Payments_Plans_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Payments_Plans_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Payments_Plans_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "payments.plans" */
export type Payments_Plans_Aggregate_Fields = {
  __typename?: "payments_plans_aggregate_fields";
  avg?: Maybe<Payments_Plans_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Payments_Plans_Max_Fields>;
  min?: Maybe<Payments_Plans_Min_Fields>;
  stddev?: Maybe<Payments_Plans_Stddev_Fields>;
  stddev_pop?: Maybe<Payments_Plans_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Payments_Plans_Stddev_Samp_Fields>;
  sum?: Maybe<Payments_Plans_Sum_Fields>;
  var_pop?: Maybe<Payments_Plans_Var_Pop_Fields>;
  var_samp?: Maybe<Payments_Plans_Var_Samp_Fields>;
  variance?: Maybe<Payments_Plans_Variance_Fields>;
};

/** aggregate fields of "payments.plans" */
export type Payments_Plans_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Payments_Plans_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "payments.plans" */
export type Payments_Plans_Aggregate_Order_By = {
  avg?: InputMaybe<Payments_Plans_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Payments_Plans_Max_Order_By>;
  min?: InputMaybe<Payments_Plans_Min_Order_By>;
  stddev?: InputMaybe<Payments_Plans_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Payments_Plans_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Payments_Plans_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Payments_Plans_Sum_Order_By>;
  var_pop?: InputMaybe<Payments_Plans_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Payments_Plans_Var_Samp_Order_By>;
  variance?: InputMaybe<Payments_Plans_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Payments_Plans_Append_Input = {
  /** Plan features */
  features?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Plan metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "payments.plans" */
export type Payments_Plans_Arr_Rel_Insert_Input = {
  data: Array<Payments_Plans_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Payments_Plans_On_Conflict>;
};

/** aggregate avg on columns */
export type Payments_Plans_Avg_Fields = {
  __typename?: "payments_plans_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: Maybe<Scalars["Float"]["output"]>;
  /** Plan price */
  price?: Maybe<Scalars["Float"]["output"]>;
  /** Trial period in days */
  trial_period_days?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "payments.plans" */
export type Payments_Plans_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: InputMaybe<Order_By>;
  /** Plan price */
  price?: InputMaybe<Order_By>;
  /** Trial period in days */
  trial_period_days?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "payments.plans". All fields are combined with a logical 'AND'. */
export type Payments_Plans_Bool_Exp = {
  _and?: InputMaybe<Array<Payments_Plans_Bool_Exp>>;
  _not?: InputMaybe<Payments_Plans_Bool_Exp>;
  _or?: InputMaybe<Array<Payments_Plans_Bool_Exp>>;
  active?: InputMaybe<Boolean_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  currency?: InputMaybe<String_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  features?: InputMaybe<Jsonb_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  interval?: InputMaybe<String_Comparison_Exp>;
  interval_count?: InputMaybe<Int_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  price?: InputMaybe<Numeric_Comparison_Exp>;
  subscriptions?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
  subscriptions_aggregate?: InputMaybe<Payments_Subscriptions_Aggregate_Bool_Exp>;
  trial_period_days?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "payments.plans" */
export enum Payments_Plans_Constraint {
  /** unique or primary key constraint on columns "id" */
  PlansPkey = "plans_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Payments_Plans_Delete_At_Path_Input = {
  /** Plan features */
  features?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Plan metadata */
  metadata?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Payments_Plans_Delete_Elem_Input = {
  /** Plan features */
  features?: InputMaybe<Scalars["Int"]["input"]>;
  /** Plan metadata */
  metadata?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Payments_Plans_Delete_Key_Input = {
  /** Plan features */
  features?: InputMaybe<Scalars["String"]["input"]>;
  /** Plan metadata */
  metadata?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "payments.plans" */
export type Payments_Plans_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: InputMaybe<Scalars["Int"]["input"]>;
  /** Plan price */
  price?: InputMaybe<Scalars["numeric"]["input"]>;
  /** Trial period in days */
  trial_period_days?: InputMaybe<Scalars["Int"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "payments.plans" */
export type Payments_Plans_Insert_Input = {
  /** Plan active status */
  active?: InputMaybe<Scalars["Boolean"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Currency code */
  currency?: InputMaybe<Scalars["String"]["input"]>;
  /** Plan description */
  description?: InputMaybe<Scalars["String"]["input"]>;
  /** Plan features */
  features?: InputMaybe<Scalars["jsonb"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Billing interval: "minute", "hour", "day", "week", "month", "year" */
  interval?: InputMaybe<Scalars["String"]["input"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: InputMaybe<Scalars["Int"]["input"]>;
  /** Plan metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Plan name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** Plan price */
  price?: InputMaybe<Scalars["numeric"]["input"]>;
  subscriptions?: InputMaybe<Payments_Subscriptions_Arr_Rel_Insert_Input>;
  /** Trial period in days */
  trial_period_days?: InputMaybe<Scalars["Int"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** Plan creator user ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Payments_Plans_Max_Fields = {
  __typename?: "payments_plans_max_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Currency code */
  currency?: Maybe<Scalars["String"]["output"]>;
  /** Plan description */
  description?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Billing interval: "minute", "hour", "day", "week", "month", "year" */
  interval?: Maybe<Scalars["String"]["output"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: Maybe<Scalars["Int"]["output"]>;
  /** Plan name */
  name?: Maybe<Scalars["String"]["output"]>;
  /** Plan price */
  price?: Maybe<Scalars["numeric"]["output"]>;
  /** Trial period in days */
  trial_period_days?: Maybe<Scalars["Int"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Plan creator user ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "payments.plans" */
export type Payments_Plans_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Currency code */
  currency?: InputMaybe<Order_By>;
  /** Plan description */
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Billing interval: "minute", "hour", "day", "week", "month", "year" */
  interval?: InputMaybe<Order_By>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: InputMaybe<Order_By>;
  /** Plan name */
  name?: InputMaybe<Order_By>;
  /** Plan price */
  price?: InputMaybe<Order_By>;
  /** Trial period in days */
  trial_period_days?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** Plan creator user ID */
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Payments_Plans_Min_Fields = {
  __typename?: "payments_plans_min_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Currency code */
  currency?: Maybe<Scalars["String"]["output"]>;
  /** Plan description */
  description?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Billing interval: "minute", "hour", "day", "week", "month", "year" */
  interval?: Maybe<Scalars["String"]["output"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: Maybe<Scalars["Int"]["output"]>;
  /** Plan name */
  name?: Maybe<Scalars["String"]["output"]>;
  /** Plan price */
  price?: Maybe<Scalars["numeric"]["output"]>;
  /** Trial period in days */
  trial_period_days?: Maybe<Scalars["Int"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Plan creator user ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "payments.plans" */
export type Payments_Plans_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Currency code */
  currency?: InputMaybe<Order_By>;
  /** Plan description */
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Billing interval: "minute", "hour", "day", "week", "month", "year" */
  interval?: InputMaybe<Order_By>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: InputMaybe<Order_By>;
  /** Plan name */
  name?: InputMaybe<Order_By>;
  /** Plan price */
  price?: InputMaybe<Order_By>;
  /** Trial period in days */
  trial_period_days?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** Plan creator user ID */
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "payments.plans" */
export type Payments_Plans_Mutation_Response = {
  __typename?: "payments_plans_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Payments_Plans>;
};

/** input type for inserting object relation for remote table "payments.plans" */
export type Payments_Plans_Obj_Rel_Insert_Input = {
  data: Payments_Plans_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Payments_Plans_On_Conflict>;
};

/** on_conflict condition type for table "payments.plans" */
export type Payments_Plans_On_Conflict = {
  constraint: Payments_Plans_Constraint;
  update_columns?: Array<Payments_Plans_Update_Column>;
  where?: InputMaybe<Payments_Plans_Bool_Exp>;
};

/** Ordering options when selecting data from "payments.plans". */
export type Payments_Plans_Order_By = {
  active?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  currency?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  features?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  interval?: InputMaybe<Order_By>;
  interval_count?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  price?: InputMaybe<Order_By>;
  subscriptions_aggregate?: InputMaybe<Payments_Subscriptions_Aggregate_Order_By>;
  trial_period_days?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: payments.plans */
export type Payments_Plans_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Payments_Plans_Prepend_Input = {
  /** Plan features */
  features?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Plan metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "payments.plans" */
export enum Payments_Plans_Select_Column {
  /** column name */
  Active = "active",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Currency = "currency",
  /** column name */
  Description = "description",
  /** column name */
  Features = "features",
  /** column name */
  Id = "id",
  /** column name */
  Interval = "interval",
  /** column name */
  IntervalCount = "interval_count",
  /** column name */
  Metadata = "metadata",
  /** column name */
  Name = "name",
  /** column name */
  Price = "price",
  /** column name */
  TrialPeriodDays = "trial_period_days",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** select "payments_plans_aggregate_bool_exp_bool_and_arguments_columns" columns of table "payments.plans" */
export enum Payments_Plans_Select_Column_Payments_Plans_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Active = "active",
}

/** select "payments_plans_aggregate_bool_exp_bool_or_arguments_columns" columns of table "payments.plans" */
export enum Payments_Plans_Select_Column_Payments_Plans_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Active = "active",
}

/** input type for updating data in table "payments.plans" */
export type Payments_Plans_Set_Input = {
  /** Plan active status */
  active?: InputMaybe<Scalars["Boolean"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Currency code */
  currency?: InputMaybe<Scalars["String"]["input"]>;
  /** Plan description */
  description?: InputMaybe<Scalars["String"]["input"]>;
  /** Plan features */
  features?: InputMaybe<Scalars["jsonb"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Billing interval: "minute", "hour", "day", "week", "month", "year" */
  interval?: InputMaybe<Scalars["String"]["input"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: InputMaybe<Scalars["Int"]["input"]>;
  /** Plan metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Plan name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** Plan price */
  price?: InputMaybe<Scalars["numeric"]["input"]>;
  /** Trial period in days */
  trial_period_days?: InputMaybe<Scalars["Int"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Plan creator user ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Payments_Plans_Stddev_Fields = {
  __typename?: "payments_plans_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: Maybe<Scalars["Float"]["output"]>;
  /** Plan price */
  price?: Maybe<Scalars["Float"]["output"]>;
  /** Trial period in days */
  trial_period_days?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "payments.plans" */
export type Payments_Plans_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: InputMaybe<Order_By>;
  /** Plan price */
  price?: InputMaybe<Order_By>;
  /** Trial period in days */
  trial_period_days?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Payments_Plans_Stddev_Pop_Fields = {
  __typename?: "payments_plans_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: Maybe<Scalars["Float"]["output"]>;
  /** Plan price */
  price?: Maybe<Scalars["Float"]["output"]>;
  /** Trial period in days */
  trial_period_days?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "payments.plans" */
export type Payments_Plans_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: InputMaybe<Order_By>;
  /** Plan price */
  price?: InputMaybe<Order_By>;
  /** Trial period in days */
  trial_period_days?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Payments_Plans_Stddev_Samp_Fields = {
  __typename?: "payments_plans_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: Maybe<Scalars["Float"]["output"]>;
  /** Plan price */
  price?: Maybe<Scalars["Float"]["output"]>;
  /** Trial period in days */
  trial_period_days?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "payments.plans" */
export type Payments_Plans_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: InputMaybe<Order_By>;
  /** Plan price */
  price?: InputMaybe<Order_By>;
  /** Trial period in days */
  trial_period_days?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "payments_plans" */
export type Payments_Plans_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Payments_Plans_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Payments_Plans_Stream_Cursor_Value_Input = {
  /** Plan active status */
  active?: InputMaybe<Scalars["Boolean"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Currency code */
  currency?: InputMaybe<Scalars["String"]["input"]>;
  /** Plan description */
  description?: InputMaybe<Scalars["String"]["input"]>;
  /** Plan features */
  features?: InputMaybe<Scalars["jsonb"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Billing interval: "minute", "hour", "day", "week", "month", "year" */
  interval?: InputMaybe<Scalars["String"]["input"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: InputMaybe<Scalars["Int"]["input"]>;
  /** Plan metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Plan name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** Plan price */
  price?: InputMaybe<Scalars["numeric"]["input"]>;
  /** Trial period in days */
  trial_period_days?: InputMaybe<Scalars["Int"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Plan creator user ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Payments_Plans_Sum_Fields = {
  __typename?: "payments_plans_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: Maybe<Scalars["Int"]["output"]>;
  /** Plan price */
  price?: Maybe<Scalars["numeric"]["output"]>;
  /** Trial period in days */
  trial_period_days?: Maybe<Scalars["Int"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "payments.plans" */
export type Payments_Plans_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: InputMaybe<Order_By>;
  /** Plan price */
  price?: InputMaybe<Order_By>;
  /** Trial period in days */
  trial_period_days?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "payments.plans" */
export enum Payments_Plans_Update_Column {
  /** column name */
  Active = "active",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Currency = "currency",
  /** column name */
  Description = "description",
  /** column name */
  Features = "features",
  /** column name */
  Id = "id",
  /** column name */
  Interval = "interval",
  /** column name */
  IntervalCount = "interval_count",
  /** column name */
  Metadata = "metadata",
  /** column name */
  Name = "name",
  /** column name */
  Price = "price",
  /** column name */
  TrialPeriodDays = "trial_period_days",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Payments_Plans_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Payments_Plans_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Payments_Plans_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Payments_Plans_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Payments_Plans_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Payments_Plans_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Payments_Plans_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Payments_Plans_Set_Input>;
  /** filter the rows which have to be updated */
  where: Payments_Plans_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Payments_Plans_Var_Pop_Fields = {
  __typename?: "payments_plans_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: Maybe<Scalars["Float"]["output"]>;
  /** Plan price */
  price?: Maybe<Scalars["Float"]["output"]>;
  /** Trial period in days */
  trial_period_days?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "payments.plans" */
export type Payments_Plans_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: InputMaybe<Order_By>;
  /** Plan price */
  price?: InputMaybe<Order_By>;
  /** Trial period in days */
  trial_period_days?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Payments_Plans_Var_Samp_Fields = {
  __typename?: "payments_plans_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: Maybe<Scalars["Float"]["output"]>;
  /** Plan price */
  price?: Maybe<Scalars["Float"]["output"]>;
  /** Trial period in days */
  trial_period_days?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "payments.plans" */
export type Payments_Plans_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: InputMaybe<Order_By>;
  /** Plan price */
  price?: InputMaybe<Order_By>;
  /** Trial period in days */
  trial_period_days?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Payments_Plans_Variance_Fields = {
  __typename?: "payments_plans_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: Maybe<Scalars["Float"]["output"]>;
  /** Plan price */
  price?: Maybe<Scalars["Float"]["output"]>;
  /** Trial period in days */
  trial_period_days?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "payments.plans" */
export type Payments_Plans_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Interval count - how many intervals between charges (minimum 1) */
  interval_count?: InputMaybe<Order_By>;
  /** Plan price */
  price?: InputMaybe<Order_By>;
  /** Trial period in days */
  trial_period_days?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "payments.providers" */
export type Payments_Providers = {
  __typename?: "payments_providers";
  /** Provider configuration */
  config?: Maybe<Scalars["jsonb"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** Default card webhook URL */
  default_card_webhook_url?: Maybe<Scalars["String"]["output"]>;
  /** Default return URL */
  default_return_url?: Maybe<Scalars["String"]["output"]>;
  /** Default webhook URL */
  default_webhook_url?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["uuid"]["output"];
  /** Active status */
  is_active?: Maybe<Scalars["Boolean"]["output"]>;
  /** Test mode flag */
  is_test_mode?: Maybe<Scalars["Boolean"]["output"]>;
  /** An array relationship */
  methods: Array<Payments_Methods>;
  /** An aggregate relationship */
  methods_aggregate: Payments_Methods_Aggregate;
  /** Provider name */
  name?: Maybe<Scalars["String"]["output"]>;
  /** An array relationship */
  operations: Array<Payments_Operations>;
  /** An aggregate relationship */
  operations_aggregate: Payments_Operations_Aggregate;
  /** An array relationship */
  subscriptions: Array<Payments_Subscriptions>;
  /** An aggregate relationship */
  subscriptions_aggregate: Payments_Subscriptions_Aggregate;
  /** Provider type */
  type?: Maybe<Scalars["String"]["output"]>;
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user?: Maybe<Users>;
  /** Owner user ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
  /** An array relationship */
  user_mappings: Array<Payments_User_Payment_Provider_Mappings>;
  /** An aggregate relationship */
  user_mappings_aggregate: Payments_User_Payment_Provider_Mappings_Aggregate;
};

/** columns and relationships of "payments.providers" */
export type Payments_ProvidersConfigArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "payments.providers" */
export type Payments_ProvidersMethodsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Methods_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Methods_Order_By>>;
  where?: InputMaybe<Payments_Methods_Bool_Exp>;
};

/** columns and relationships of "payments.providers" */
export type Payments_ProvidersMethods_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Methods_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Methods_Order_By>>;
  where?: InputMaybe<Payments_Methods_Bool_Exp>;
};

/** columns and relationships of "payments.providers" */
export type Payments_ProvidersOperationsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Operations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Operations_Order_By>>;
  where?: InputMaybe<Payments_Operations_Bool_Exp>;
};

/** columns and relationships of "payments.providers" */
export type Payments_ProvidersOperations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Operations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Operations_Order_By>>;
  where?: InputMaybe<Payments_Operations_Bool_Exp>;
};

/** columns and relationships of "payments.providers" */
export type Payments_ProvidersSubscriptionsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Subscriptions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Subscriptions_Order_By>>;
  where?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
};

/** columns and relationships of "payments.providers" */
export type Payments_ProvidersSubscriptions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Subscriptions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Subscriptions_Order_By>>;
  where?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
};

/** columns and relationships of "payments.providers" */
export type Payments_ProvidersUser_MappingsArgs = {
  distinct_on?: InputMaybe<
    Array<Payments_User_Payment_Provider_Mappings_Select_Column>
  >;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<
    Array<Payments_User_Payment_Provider_Mappings_Order_By>
  >;
  where?: InputMaybe<Payments_User_Payment_Provider_Mappings_Bool_Exp>;
};

/** columns and relationships of "payments.providers" */
export type Payments_ProvidersUser_Mappings_AggregateArgs = {
  distinct_on?: InputMaybe<
    Array<Payments_User_Payment_Provider_Mappings_Select_Column>
  >;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<
    Array<Payments_User_Payment_Provider_Mappings_Order_By>
  >;
  where?: InputMaybe<Payments_User_Payment_Provider_Mappings_Bool_Exp>;
};

/** aggregated selection of "payments.providers" */
export type Payments_Providers_Aggregate = {
  __typename?: "payments_providers_aggregate";
  aggregate?: Maybe<Payments_Providers_Aggregate_Fields>;
  nodes: Array<Payments_Providers>;
};

export type Payments_Providers_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Payments_Providers_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Payments_Providers_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Payments_Providers_Aggregate_Bool_Exp_Count>;
};

export type Payments_Providers_Aggregate_Bool_Exp_Bool_And = {
  arguments: Payments_Providers_Select_Column_Payments_Providers_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Payments_Providers_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Payments_Providers_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Payments_Providers_Select_Column_Payments_Providers_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Payments_Providers_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Payments_Providers_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Payments_Providers_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Payments_Providers_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "payments.providers" */
export type Payments_Providers_Aggregate_Fields = {
  __typename?: "payments_providers_aggregate_fields";
  avg?: Maybe<Payments_Providers_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Payments_Providers_Max_Fields>;
  min?: Maybe<Payments_Providers_Min_Fields>;
  stddev?: Maybe<Payments_Providers_Stddev_Fields>;
  stddev_pop?: Maybe<Payments_Providers_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Payments_Providers_Stddev_Samp_Fields>;
  sum?: Maybe<Payments_Providers_Sum_Fields>;
  var_pop?: Maybe<Payments_Providers_Var_Pop_Fields>;
  var_samp?: Maybe<Payments_Providers_Var_Samp_Fields>;
  variance?: Maybe<Payments_Providers_Variance_Fields>;
};

/** aggregate fields of "payments.providers" */
export type Payments_Providers_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Payments_Providers_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "payments.providers" */
export type Payments_Providers_Aggregate_Order_By = {
  avg?: InputMaybe<Payments_Providers_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Payments_Providers_Max_Order_By>;
  min?: InputMaybe<Payments_Providers_Min_Order_By>;
  stddev?: InputMaybe<Payments_Providers_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Payments_Providers_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Payments_Providers_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Payments_Providers_Sum_Order_By>;
  var_pop?: InputMaybe<Payments_Providers_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Payments_Providers_Var_Samp_Order_By>;
  variance?: InputMaybe<Payments_Providers_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Payments_Providers_Append_Input = {
  /** Provider configuration */
  config?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "payments.providers" */
export type Payments_Providers_Arr_Rel_Insert_Input = {
  data: Array<Payments_Providers_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Payments_Providers_On_Conflict>;
};

/** aggregate avg on columns */
export type Payments_Providers_Avg_Fields = {
  __typename?: "payments_providers_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "payments.providers" */
export type Payments_Providers_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "payments.providers". All fields are combined with a logical 'AND'. */
export type Payments_Providers_Bool_Exp = {
  _and?: InputMaybe<Array<Payments_Providers_Bool_Exp>>;
  _not?: InputMaybe<Payments_Providers_Bool_Exp>;
  _or?: InputMaybe<Array<Payments_Providers_Bool_Exp>>;
  config?: InputMaybe<Jsonb_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  default_card_webhook_url?: InputMaybe<String_Comparison_Exp>;
  default_return_url?: InputMaybe<String_Comparison_Exp>;
  default_webhook_url?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  is_test_mode?: InputMaybe<Boolean_Comparison_Exp>;
  methods?: InputMaybe<Payments_Methods_Bool_Exp>;
  methods_aggregate?: InputMaybe<Payments_Methods_Aggregate_Bool_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  operations?: InputMaybe<Payments_Operations_Bool_Exp>;
  operations_aggregate?: InputMaybe<Payments_Operations_Aggregate_Bool_Exp>;
  subscriptions?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
  subscriptions_aggregate?: InputMaybe<Payments_Subscriptions_Aggregate_Bool_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
  user_mappings?: InputMaybe<Payments_User_Payment_Provider_Mappings_Bool_Exp>;
  user_mappings_aggregate?: InputMaybe<Payments_User_Payment_Provider_Mappings_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "payments.providers" */
export enum Payments_Providers_Constraint {
  /** unique or primary key constraint on columns "type", "is_test_mode", "name" */
  ProvidersNameTypeTestModeUnique = "providers_name_type_test_mode_unique",
  /** unique or primary key constraint on columns "id" */
  ProvidersPkey = "providers_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Payments_Providers_Delete_At_Path_Input = {
  /** Provider configuration */
  config?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Payments_Providers_Delete_Elem_Input = {
  /** Provider configuration */
  config?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Payments_Providers_Delete_Key_Input = {
  /** Provider configuration */
  config?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "payments.providers" */
export type Payments_Providers_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "payments.providers" */
export type Payments_Providers_Insert_Input = {
  /** Provider configuration */
  config?: InputMaybe<Scalars["jsonb"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Default card webhook URL */
  default_card_webhook_url?: InputMaybe<Scalars["String"]["input"]>;
  /** Default return URL */
  default_return_url?: InputMaybe<Scalars["String"]["input"]>;
  /** Default webhook URL */
  default_webhook_url?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Active status */
  is_active?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Test mode flag */
  is_test_mode?: InputMaybe<Scalars["Boolean"]["input"]>;
  methods?: InputMaybe<Payments_Methods_Arr_Rel_Insert_Input>;
  /** Provider name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  operations?: InputMaybe<Payments_Operations_Arr_Rel_Insert_Input>;
  subscriptions?: InputMaybe<Payments_Subscriptions_Arr_Rel_Insert_Input>;
  /** Provider type */
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** Owner user ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  user_mappings?: InputMaybe<Payments_User_Payment_Provider_Mappings_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Payments_Providers_Max_Fields = {
  __typename?: "payments_providers_max_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Default card webhook URL */
  default_card_webhook_url?: Maybe<Scalars["String"]["output"]>;
  /** Default return URL */
  default_return_url?: Maybe<Scalars["String"]["output"]>;
  /** Default webhook URL */
  default_webhook_url?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Provider name */
  name?: Maybe<Scalars["String"]["output"]>;
  /** Provider type */
  type?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Owner user ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "payments.providers" */
export type Payments_Providers_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Default card webhook URL */
  default_card_webhook_url?: InputMaybe<Order_By>;
  /** Default return URL */
  default_return_url?: InputMaybe<Order_By>;
  /** Default webhook URL */
  default_webhook_url?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Provider name */
  name?: InputMaybe<Order_By>;
  /** Provider type */
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** Owner user ID */
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Payments_Providers_Min_Fields = {
  __typename?: "payments_providers_min_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Default card webhook URL */
  default_card_webhook_url?: Maybe<Scalars["String"]["output"]>;
  /** Default return URL */
  default_return_url?: Maybe<Scalars["String"]["output"]>;
  /** Default webhook URL */
  default_webhook_url?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Provider name */
  name?: Maybe<Scalars["String"]["output"]>;
  /** Provider type */
  type?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Owner user ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "payments.providers" */
export type Payments_Providers_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** Default card webhook URL */
  default_card_webhook_url?: InputMaybe<Order_By>;
  /** Default return URL */
  default_return_url?: InputMaybe<Order_By>;
  /** Default webhook URL */
  default_webhook_url?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Provider name */
  name?: InputMaybe<Order_By>;
  /** Provider type */
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** Owner user ID */
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "payments.providers" */
export type Payments_Providers_Mutation_Response = {
  __typename?: "payments_providers_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Payments_Providers>;
};

/** input type for inserting object relation for remote table "payments.providers" */
export type Payments_Providers_Obj_Rel_Insert_Input = {
  data: Payments_Providers_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Payments_Providers_On_Conflict>;
};

/** on_conflict condition type for table "payments.providers" */
export type Payments_Providers_On_Conflict = {
  constraint: Payments_Providers_Constraint;
  update_columns?: Array<Payments_Providers_Update_Column>;
  where?: InputMaybe<Payments_Providers_Bool_Exp>;
};

/** Ordering options when selecting data from "payments.providers". */
export type Payments_Providers_Order_By = {
  config?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  default_card_webhook_url?: InputMaybe<Order_By>;
  default_return_url?: InputMaybe<Order_By>;
  default_webhook_url?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  is_test_mode?: InputMaybe<Order_By>;
  methods_aggregate?: InputMaybe<Payments_Methods_Aggregate_Order_By>;
  name?: InputMaybe<Order_By>;
  operations_aggregate?: InputMaybe<Payments_Operations_Aggregate_Order_By>;
  subscriptions_aggregate?: InputMaybe<Payments_Subscriptions_Aggregate_Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
  user_mappings_aggregate?: InputMaybe<Payments_User_Payment_Provider_Mappings_Aggregate_Order_By>;
};

/** primary key columns input for table: payments.providers */
export type Payments_Providers_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Payments_Providers_Prepend_Input = {
  /** Provider configuration */
  config?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "payments.providers" */
export enum Payments_Providers_Select_Column {
  /** column name */
  Config = "config",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DefaultCardWebhookUrl = "default_card_webhook_url",
  /** column name */
  DefaultReturnUrl = "default_return_url",
  /** column name */
  DefaultWebhookUrl = "default_webhook_url",
  /** column name */
  Id = "id",
  /** column name */
  IsActive = "is_active",
  /** column name */
  IsTestMode = "is_test_mode",
  /** column name */
  Name = "name",
  /** column name */
  Type = "type",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** select "payments_providers_aggregate_bool_exp_bool_and_arguments_columns" columns of table "payments.providers" */
export enum Payments_Providers_Select_Column_Payments_Providers_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsActive = "is_active",
  /** column name */
  IsTestMode = "is_test_mode",
}

/** select "payments_providers_aggregate_bool_exp_bool_or_arguments_columns" columns of table "payments.providers" */
export enum Payments_Providers_Select_Column_Payments_Providers_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsActive = "is_active",
  /** column name */
  IsTestMode = "is_test_mode",
}

/** input type for updating data in table "payments.providers" */
export type Payments_Providers_Set_Input = {
  /** Provider configuration */
  config?: InputMaybe<Scalars["jsonb"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Default card webhook URL */
  default_card_webhook_url?: InputMaybe<Scalars["String"]["input"]>;
  /** Default return URL */
  default_return_url?: InputMaybe<Scalars["String"]["input"]>;
  /** Default webhook URL */
  default_webhook_url?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Active status */
  is_active?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Test mode flag */
  is_test_mode?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Provider name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** Provider type */
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Owner user ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Payments_Providers_Stddev_Fields = {
  __typename?: "payments_providers_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "payments.providers" */
export type Payments_Providers_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Payments_Providers_Stddev_Pop_Fields = {
  __typename?: "payments_providers_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "payments.providers" */
export type Payments_Providers_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Payments_Providers_Stddev_Samp_Fields = {
  __typename?: "payments_providers_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "payments.providers" */
export type Payments_Providers_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "payments_providers" */
export type Payments_Providers_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Payments_Providers_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Payments_Providers_Stream_Cursor_Value_Input = {
  /** Provider configuration */
  config?: InputMaybe<Scalars["jsonb"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Default card webhook URL */
  default_card_webhook_url?: InputMaybe<Scalars["String"]["input"]>;
  /** Default return URL */
  default_return_url?: InputMaybe<Scalars["String"]["input"]>;
  /** Default webhook URL */
  default_webhook_url?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Active status */
  is_active?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Test mode flag */
  is_test_mode?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Provider name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** Provider type */
  type?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Owner user ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Payments_Providers_Sum_Fields = {
  __typename?: "payments_providers_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "payments.providers" */
export type Payments_Providers_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "payments.providers" */
export enum Payments_Providers_Update_Column {
  /** column name */
  Config = "config",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DefaultCardWebhookUrl = "default_card_webhook_url",
  /** column name */
  DefaultReturnUrl = "default_return_url",
  /** column name */
  DefaultWebhookUrl = "default_webhook_url",
  /** column name */
  Id = "id",
  /** column name */
  IsActive = "is_active",
  /** column name */
  IsTestMode = "is_test_mode",
  /** column name */
  Name = "name",
  /** column name */
  Type = "type",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Payments_Providers_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Payments_Providers_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Payments_Providers_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Payments_Providers_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Payments_Providers_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Payments_Providers_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Payments_Providers_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Payments_Providers_Set_Input>;
  /** filter the rows which have to be updated */
  where: Payments_Providers_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Payments_Providers_Var_Pop_Fields = {
  __typename?: "payments_providers_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "payments.providers" */
export type Payments_Providers_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Payments_Providers_Var_Samp_Fields = {
  __typename?: "payments_providers_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "payments.providers" */
export type Payments_Providers_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Payments_Providers_Variance_Fields = {
  __typename?: "payments_providers_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "payments.providers" */
export type Payments_Providers_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "payments.subscriptions" */
export type Payments_Subscriptions = {
  __typename?: "payments_subscriptions";
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: Maybe<Scalars["bigint"]["output"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: Maybe<Scalars["Int"]["output"]>;
  /** Cancel at period end flag */
  cancel_at_period_end?: Maybe<Scalars["Boolean"]["output"]>;
  /** Cancellation timestamp */
  canceled_at?: Maybe<Scalars["bigint"]["output"]>;
  created_at: Scalars["bigint"]["output"];
  /** Current period end */
  current_period_end?: Maybe<Scalars["bigint"]["output"]>;
  /** Current period start */
  current_period_start?: Maybe<Scalars["bigint"]["output"]>;
  /** End timestamp */
  ended_at?: Maybe<Scalars["bigint"]["output"]>;
  /** External subscription ID */
  external_subscription_id?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["uuid"]["output"];
  /** Last successful billing date timestamp */
  last_billing_date?: Maybe<Scalars["bigint"]["output"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: Maybe<Scalars["Int"]["output"]>;
  /** Subscription metadata */
  metadata?: Maybe<Scalars["jsonb"]["output"]>;
  /** An object relationship */
  method: Payments_Methods;
  /** Payment method ID */
  method_id: Scalars["uuid"]["output"];
  /** Next billing date timestamp */
  next_billing_date?: Maybe<Scalars["bigint"]["output"]>;
  /** Object HID */
  object_hid?: Maybe<Scalars["String"]["output"]>;
  /** An array relationship */
  operations: Array<Payments_Operations>;
  /** An aggregate relationship */
  operations_aggregate: Payments_Operations_Aggregate;
  /** An object relationship */
  plan?: Maybe<Payments_Plans>;
  /** Plan ID */
  plan_id?: Maybe<Scalars["uuid"]["output"]>;
  /** An object relationship */
  provider: Payments_Providers;
  /** Provider ID */
  provider_id: Scalars["uuid"]["output"];
  /** Subscription status */
  status: Scalars["String"]["output"];
  /** Trial end timestamp */
  trial_ends_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user: Users;
  /** User ID */
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "payments.subscriptions" */
export type Payments_SubscriptionsMetadataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "payments.subscriptions" */
export type Payments_SubscriptionsOperationsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Operations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Operations_Order_By>>;
  where?: InputMaybe<Payments_Operations_Bool_Exp>;
};

/** columns and relationships of "payments.subscriptions" */
export type Payments_SubscriptionsOperations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Operations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Operations_Order_By>>;
  where?: InputMaybe<Payments_Operations_Bool_Exp>;
};

/** aggregated selection of "payments.subscriptions" */
export type Payments_Subscriptions_Aggregate = {
  __typename?: "payments_subscriptions_aggregate";
  aggregate?: Maybe<Payments_Subscriptions_Aggregate_Fields>;
  nodes: Array<Payments_Subscriptions>;
};

export type Payments_Subscriptions_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Payments_Subscriptions_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Payments_Subscriptions_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Payments_Subscriptions_Aggregate_Bool_Exp_Count>;
};

export type Payments_Subscriptions_Aggregate_Bool_Exp_Bool_And = {
  arguments: Payments_Subscriptions_Select_Column_Payments_Subscriptions_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Payments_Subscriptions_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Payments_Subscriptions_Select_Column_Payments_Subscriptions_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Payments_Subscriptions_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Payments_Subscriptions_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "payments.subscriptions" */
export type Payments_Subscriptions_Aggregate_Fields = {
  __typename?: "payments_subscriptions_aggregate_fields";
  avg?: Maybe<Payments_Subscriptions_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Payments_Subscriptions_Max_Fields>;
  min?: Maybe<Payments_Subscriptions_Min_Fields>;
  stddev?: Maybe<Payments_Subscriptions_Stddev_Fields>;
  stddev_pop?: Maybe<Payments_Subscriptions_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Payments_Subscriptions_Stddev_Samp_Fields>;
  sum?: Maybe<Payments_Subscriptions_Sum_Fields>;
  var_pop?: Maybe<Payments_Subscriptions_Var_Pop_Fields>;
  var_samp?: Maybe<Payments_Subscriptions_Var_Samp_Fields>;
  variance?: Maybe<Payments_Subscriptions_Variance_Fields>;
};

/** aggregate fields of "payments.subscriptions" */
export type Payments_Subscriptions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Payments_Subscriptions_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "payments.subscriptions" */
export type Payments_Subscriptions_Aggregate_Order_By = {
  avg?: InputMaybe<Payments_Subscriptions_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Payments_Subscriptions_Max_Order_By>;
  min?: InputMaybe<Payments_Subscriptions_Min_Order_By>;
  stddev?: InputMaybe<Payments_Subscriptions_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Payments_Subscriptions_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Payments_Subscriptions_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Payments_Subscriptions_Sum_Order_By>;
  var_pop?: InputMaybe<Payments_Subscriptions_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Payments_Subscriptions_Var_Samp_Order_By>;
  variance?: InputMaybe<Payments_Subscriptions_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Payments_Subscriptions_Append_Input = {
  /** Subscription metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "payments.subscriptions" */
export type Payments_Subscriptions_Arr_Rel_Insert_Input = {
  data: Array<Payments_Subscriptions_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Payments_Subscriptions_On_Conflict>;
};

/** aggregate avg on columns */
export type Payments_Subscriptions_Avg_Fields = {
  __typename?: "payments_subscriptions_avg_fields";
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: Maybe<Scalars["Float"]["output"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: Maybe<Scalars["Float"]["output"]>;
  /** Cancellation timestamp */
  canceled_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Current period end */
  current_period_end?: Maybe<Scalars["Float"]["output"]>;
  /** Current period start */
  current_period_start?: Maybe<Scalars["Float"]["output"]>;
  /** End timestamp */
  ended_at?: Maybe<Scalars["Float"]["output"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: Maybe<Scalars["Float"]["output"]>;
  /** Next billing date timestamp */
  next_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Trial end timestamp */
  trial_ends_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "payments.subscriptions" */
export type Payments_Subscriptions_Avg_Order_By = {
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Order_By>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Order_By>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Current period end */
  current_period_end?: InputMaybe<Order_By>;
  /** Current period start */
  current_period_start?: InputMaybe<Order_By>;
  /** End timestamp */
  ended_at?: InputMaybe<Order_By>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Order_By>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Order_By>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Order_By>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "payments.subscriptions". All fields are combined with a logical 'AND'. */
export type Payments_Subscriptions_Bool_Exp = {
  _and?: InputMaybe<Array<Payments_Subscriptions_Bool_Exp>>;
  _not?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
  _or?: InputMaybe<Array<Payments_Subscriptions_Bool_Exp>>;
  billing_anchor_date?: InputMaybe<Bigint_Comparison_Exp>;
  billing_retry_count?: InputMaybe<Int_Comparison_Exp>;
  cancel_at_period_end?: InputMaybe<Boolean_Comparison_Exp>;
  canceled_at?: InputMaybe<Bigint_Comparison_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  current_period_end?: InputMaybe<Bigint_Comparison_Exp>;
  current_period_start?: InputMaybe<Bigint_Comparison_Exp>;
  ended_at?: InputMaybe<Bigint_Comparison_Exp>;
  external_subscription_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  last_billing_date?: InputMaybe<Bigint_Comparison_Exp>;
  max_billing_retries?: InputMaybe<Int_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  method?: InputMaybe<Payments_Methods_Bool_Exp>;
  method_id?: InputMaybe<Uuid_Comparison_Exp>;
  next_billing_date?: InputMaybe<Bigint_Comparison_Exp>;
  object_hid?: InputMaybe<String_Comparison_Exp>;
  operations?: InputMaybe<Payments_Operations_Bool_Exp>;
  operations_aggregate?: InputMaybe<Payments_Operations_Aggregate_Bool_Exp>;
  plan?: InputMaybe<Payments_Plans_Bool_Exp>;
  plan_id?: InputMaybe<Uuid_Comparison_Exp>;
  provider?: InputMaybe<Payments_Providers_Bool_Exp>;
  provider_id?: InputMaybe<Uuid_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  trial_ends_at?: InputMaybe<Bigint_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "payments.subscriptions" */
export enum Payments_Subscriptions_Constraint {
  /** unique or primary key constraint on columns "id" */
  SubscriptionsPkey = "subscriptions_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Payments_Subscriptions_Delete_At_Path_Input = {
  /** Subscription metadata */
  metadata?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Payments_Subscriptions_Delete_Elem_Input = {
  /** Subscription metadata */
  metadata?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Payments_Subscriptions_Delete_Key_Input = {
  /** Subscription metadata */
  metadata?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "payments.subscriptions" */
export type Payments_Subscriptions_Inc_Input = {
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Scalars["Int"]["input"]>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Scalars["bigint"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Current period end */
  current_period_end?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Current period start */
  current_period_start?: InputMaybe<Scalars["bigint"]["input"]>;
  /** End timestamp */
  ended_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Scalars["Int"]["input"]>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "payments.subscriptions" */
export type Payments_Subscriptions_Insert_Input = {
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Scalars["Int"]["input"]>;
  /** Cancel at period end flag */
  cancel_at_period_end?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Scalars["bigint"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Current period end */
  current_period_end?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Current period start */
  current_period_start?: InputMaybe<Scalars["bigint"]["input"]>;
  /** End timestamp */
  ended_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** External subscription ID */
  external_subscription_id?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Scalars["Int"]["input"]>;
  /** Subscription metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  method?: InputMaybe<Payments_Methods_Obj_Rel_Insert_Input>;
  /** Payment method ID */
  method_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Object HID */
  object_hid?: InputMaybe<Scalars["String"]["input"]>;
  operations?: InputMaybe<Payments_Operations_Arr_Rel_Insert_Input>;
  plan?: InputMaybe<Payments_Plans_Obj_Rel_Insert_Input>;
  /** Plan ID */
  plan_id?: InputMaybe<Scalars["uuid"]["input"]>;
  provider?: InputMaybe<Payments_Providers_Obj_Rel_Insert_Input>;
  /** Provider ID */
  provider_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Subscription status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** User ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Payments_Subscriptions_Max_Fields = {
  __typename?: "payments_subscriptions_max_fields";
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: Maybe<Scalars["bigint"]["output"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: Maybe<Scalars["Int"]["output"]>;
  /** Cancellation timestamp */
  canceled_at?: Maybe<Scalars["bigint"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Current period end */
  current_period_end?: Maybe<Scalars["bigint"]["output"]>;
  /** Current period start */
  current_period_start?: Maybe<Scalars["bigint"]["output"]>;
  /** End timestamp */
  ended_at?: Maybe<Scalars["bigint"]["output"]>;
  /** External subscription ID */
  external_subscription_id?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: Maybe<Scalars["bigint"]["output"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: Maybe<Scalars["Int"]["output"]>;
  /** Payment method ID */
  method_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Next billing date timestamp */
  next_billing_date?: Maybe<Scalars["bigint"]["output"]>;
  /** Object HID */
  object_hid?: Maybe<Scalars["String"]["output"]>;
  /** Plan ID */
  plan_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Provider ID */
  provider_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Subscription status */
  status?: Maybe<Scalars["String"]["output"]>;
  /** Trial end timestamp */
  trial_ends_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "payments.subscriptions" */
export type Payments_Subscriptions_Max_Order_By = {
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Order_By>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Order_By>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Current period end */
  current_period_end?: InputMaybe<Order_By>;
  /** Current period start */
  current_period_start?: InputMaybe<Order_By>;
  /** End timestamp */
  ended_at?: InputMaybe<Order_By>;
  /** External subscription ID */
  external_subscription_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Order_By>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Order_By>;
  /** Payment method ID */
  method_id?: InputMaybe<Order_By>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Order_By>;
  /** Object HID */
  object_hid?: InputMaybe<Order_By>;
  /** Plan ID */
  plan_id?: InputMaybe<Order_By>;
  /** Provider ID */
  provider_id?: InputMaybe<Order_By>;
  /** Subscription status */
  status?: InputMaybe<Order_By>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** User ID */
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Payments_Subscriptions_Min_Fields = {
  __typename?: "payments_subscriptions_min_fields";
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: Maybe<Scalars["bigint"]["output"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: Maybe<Scalars["Int"]["output"]>;
  /** Cancellation timestamp */
  canceled_at?: Maybe<Scalars["bigint"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Current period end */
  current_period_end?: Maybe<Scalars["bigint"]["output"]>;
  /** Current period start */
  current_period_start?: Maybe<Scalars["bigint"]["output"]>;
  /** End timestamp */
  ended_at?: Maybe<Scalars["bigint"]["output"]>;
  /** External subscription ID */
  external_subscription_id?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: Maybe<Scalars["bigint"]["output"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: Maybe<Scalars["Int"]["output"]>;
  /** Payment method ID */
  method_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Next billing date timestamp */
  next_billing_date?: Maybe<Scalars["bigint"]["output"]>;
  /** Object HID */
  object_hid?: Maybe<Scalars["String"]["output"]>;
  /** Plan ID */
  plan_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Provider ID */
  provider_id?: Maybe<Scalars["uuid"]["output"]>;
  /** Subscription status */
  status?: Maybe<Scalars["String"]["output"]>;
  /** Trial end timestamp */
  trial_ends_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "payments.subscriptions" */
export type Payments_Subscriptions_Min_Order_By = {
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Order_By>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Order_By>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Current period end */
  current_period_end?: InputMaybe<Order_By>;
  /** Current period start */
  current_period_start?: InputMaybe<Order_By>;
  /** End timestamp */
  ended_at?: InputMaybe<Order_By>;
  /** External subscription ID */
  external_subscription_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Order_By>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Order_By>;
  /** Payment method ID */
  method_id?: InputMaybe<Order_By>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Order_By>;
  /** Object HID */
  object_hid?: InputMaybe<Order_By>;
  /** Plan ID */
  plan_id?: InputMaybe<Order_By>;
  /** Provider ID */
  provider_id?: InputMaybe<Order_By>;
  /** Subscription status */
  status?: InputMaybe<Order_By>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** User ID */
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "payments.subscriptions" */
export type Payments_Subscriptions_Mutation_Response = {
  __typename?: "payments_subscriptions_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Payments_Subscriptions>;
};

/** input type for inserting object relation for remote table "payments.subscriptions" */
export type Payments_Subscriptions_Obj_Rel_Insert_Input = {
  data: Payments_Subscriptions_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Payments_Subscriptions_On_Conflict>;
};

/** on_conflict condition type for table "payments.subscriptions" */
export type Payments_Subscriptions_On_Conflict = {
  constraint: Payments_Subscriptions_Constraint;
  update_columns?: Array<Payments_Subscriptions_Update_Column>;
  where?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
};

/** Ordering options when selecting data from "payments.subscriptions". */
export type Payments_Subscriptions_Order_By = {
  billing_anchor_date?: InputMaybe<Order_By>;
  billing_retry_count?: InputMaybe<Order_By>;
  cancel_at_period_end?: InputMaybe<Order_By>;
  canceled_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  current_period_end?: InputMaybe<Order_By>;
  current_period_start?: InputMaybe<Order_By>;
  ended_at?: InputMaybe<Order_By>;
  external_subscription_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  last_billing_date?: InputMaybe<Order_By>;
  max_billing_retries?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  method?: InputMaybe<Payments_Methods_Order_By>;
  method_id?: InputMaybe<Order_By>;
  next_billing_date?: InputMaybe<Order_By>;
  object_hid?: InputMaybe<Order_By>;
  operations_aggregate?: InputMaybe<Payments_Operations_Aggregate_Order_By>;
  plan?: InputMaybe<Payments_Plans_Order_By>;
  plan_id?: InputMaybe<Order_By>;
  provider?: InputMaybe<Payments_Providers_Order_By>;
  provider_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  trial_ends_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: payments.subscriptions */
export type Payments_Subscriptions_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Payments_Subscriptions_Prepend_Input = {
  /** Subscription metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "payments.subscriptions" */
export enum Payments_Subscriptions_Select_Column {
  /** column name */
  BillingAnchorDate = "billing_anchor_date",
  /** column name */
  BillingRetryCount = "billing_retry_count",
  /** column name */
  CancelAtPeriodEnd = "cancel_at_period_end",
  /** column name */
  CanceledAt = "canceled_at",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  CurrentPeriodEnd = "current_period_end",
  /** column name */
  CurrentPeriodStart = "current_period_start",
  /** column name */
  EndedAt = "ended_at",
  /** column name */
  ExternalSubscriptionId = "external_subscription_id",
  /** column name */
  Id = "id",
  /** column name */
  LastBillingDate = "last_billing_date",
  /** column name */
  MaxBillingRetries = "max_billing_retries",
  /** column name */
  Metadata = "metadata",
  /** column name */
  MethodId = "method_id",
  /** column name */
  NextBillingDate = "next_billing_date",
  /** column name */
  ObjectHid = "object_hid",
  /** column name */
  PlanId = "plan_id",
  /** column name */
  ProviderId = "provider_id",
  /** column name */
  Status = "status",
  /** column name */
  TrialEndsAt = "trial_ends_at",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** select "payments_subscriptions_aggregate_bool_exp_bool_and_arguments_columns" columns of table "payments.subscriptions" */
export enum Payments_Subscriptions_Select_Column_Payments_Subscriptions_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  CancelAtPeriodEnd = "cancel_at_period_end",
}

/** select "payments_subscriptions_aggregate_bool_exp_bool_or_arguments_columns" columns of table "payments.subscriptions" */
export enum Payments_Subscriptions_Select_Column_Payments_Subscriptions_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  CancelAtPeriodEnd = "cancel_at_period_end",
}

/** input type for updating data in table "payments.subscriptions" */
export type Payments_Subscriptions_Set_Input = {
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Scalars["Int"]["input"]>;
  /** Cancel at period end flag */
  cancel_at_period_end?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Scalars["bigint"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Current period end */
  current_period_end?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Current period start */
  current_period_start?: InputMaybe<Scalars["bigint"]["input"]>;
  /** End timestamp */
  ended_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** External subscription ID */
  external_subscription_id?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Scalars["Int"]["input"]>;
  /** Subscription metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Payment method ID */
  method_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Object HID */
  object_hid?: InputMaybe<Scalars["String"]["input"]>;
  /** Plan ID */
  plan_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Provider ID */
  provider_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Subscription status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Payments_Subscriptions_Stddev_Fields = {
  __typename?: "payments_subscriptions_stddev_fields";
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: Maybe<Scalars["Float"]["output"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: Maybe<Scalars["Float"]["output"]>;
  /** Cancellation timestamp */
  canceled_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Current period end */
  current_period_end?: Maybe<Scalars["Float"]["output"]>;
  /** Current period start */
  current_period_start?: Maybe<Scalars["Float"]["output"]>;
  /** End timestamp */
  ended_at?: Maybe<Scalars["Float"]["output"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: Maybe<Scalars["Float"]["output"]>;
  /** Next billing date timestamp */
  next_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Trial end timestamp */
  trial_ends_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "payments.subscriptions" */
export type Payments_Subscriptions_Stddev_Order_By = {
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Order_By>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Order_By>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Current period end */
  current_period_end?: InputMaybe<Order_By>;
  /** Current period start */
  current_period_start?: InputMaybe<Order_By>;
  /** End timestamp */
  ended_at?: InputMaybe<Order_By>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Order_By>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Order_By>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Order_By>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Payments_Subscriptions_Stddev_Pop_Fields = {
  __typename?: "payments_subscriptions_stddev_pop_fields";
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: Maybe<Scalars["Float"]["output"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: Maybe<Scalars["Float"]["output"]>;
  /** Cancellation timestamp */
  canceled_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Current period end */
  current_period_end?: Maybe<Scalars["Float"]["output"]>;
  /** Current period start */
  current_period_start?: Maybe<Scalars["Float"]["output"]>;
  /** End timestamp */
  ended_at?: Maybe<Scalars["Float"]["output"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: Maybe<Scalars["Float"]["output"]>;
  /** Next billing date timestamp */
  next_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Trial end timestamp */
  trial_ends_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "payments.subscriptions" */
export type Payments_Subscriptions_Stddev_Pop_Order_By = {
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Order_By>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Order_By>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Current period end */
  current_period_end?: InputMaybe<Order_By>;
  /** Current period start */
  current_period_start?: InputMaybe<Order_By>;
  /** End timestamp */
  ended_at?: InputMaybe<Order_By>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Order_By>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Order_By>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Order_By>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Payments_Subscriptions_Stddev_Samp_Fields = {
  __typename?: "payments_subscriptions_stddev_samp_fields";
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: Maybe<Scalars["Float"]["output"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: Maybe<Scalars["Float"]["output"]>;
  /** Cancellation timestamp */
  canceled_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Current period end */
  current_period_end?: Maybe<Scalars["Float"]["output"]>;
  /** Current period start */
  current_period_start?: Maybe<Scalars["Float"]["output"]>;
  /** End timestamp */
  ended_at?: Maybe<Scalars["Float"]["output"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: Maybe<Scalars["Float"]["output"]>;
  /** Next billing date timestamp */
  next_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Trial end timestamp */
  trial_ends_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "payments.subscriptions" */
export type Payments_Subscriptions_Stddev_Samp_Order_By = {
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Order_By>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Order_By>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Current period end */
  current_period_end?: InputMaybe<Order_By>;
  /** Current period start */
  current_period_start?: InputMaybe<Order_By>;
  /** End timestamp */
  ended_at?: InputMaybe<Order_By>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Order_By>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Order_By>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Order_By>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "payments_subscriptions" */
export type Payments_Subscriptions_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Payments_Subscriptions_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Payments_Subscriptions_Stream_Cursor_Value_Input = {
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Scalars["Int"]["input"]>;
  /** Cancel at period end flag */
  cancel_at_period_end?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Scalars["bigint"]["input"]>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Current period end */
  current_period_end?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Current period start */
  current_period_start?: InputMaybe<Scalars["bigint"]["input"]>;
  /** End timestamp */
  ended_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** External subscription ID */
  external_subscription_id?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Scalars["Int"]["input"]>;
  /** Subscription metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Payment method ID */
  method_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Object HID */
  object_hid?: InputMaybe<Scalars["String"]["input"]>;
  /** Plan ID */
  plan_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Provider ID */
  provider_id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Subscription status */
  status?: InputMaybe<Scalars["String"]["input"]>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Payments_Subscriptions_Sum_Fields = {
  __typename?: "payments_subscriptions_sum_fields";
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: Maybe<Scalars["bigint"]["output"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: Maybe<Scalars["Int"]["output"]>;
  /** Cancellation timestamp */
  canceled_at?: Maybe<Scalars["bigint"]["output"]>;
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Current period end */
  current_period_end?: Maybe<Scalars["bigint"]["output"]>;
  /** Current period start */
  current_period_start?: Maybe<Scalars["bigint"]["output"]>;
  /** End timestamp */
  ended_at?: Maybe<Scalars["bigint"]["output"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: Maybe<Scalars["bigint"]["output"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: Maybe<Scalars["Int"]["output"]>;
  /** Next billing date timestamp */
  next_billing_date?: Maybe<Scalars["bigint"]["output"]>;
  /** Trial end timestamp */
  trial_ends_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "payments.subscriptions" */
export type Payments_Subscriptions_Sum_Order_By = {
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Order_By>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Order_By>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Current period end */
  current_period_end?: InputMaybe<Order_By>;
  /** Current period start */
  current_period_start?: InputMaybe<Order_By>;
  /** End timestamp */
  ended_at?: InputMaybe<Order_By>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Order_By>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Order_By>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Order_By>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "payments.subscriptions" */
export enum Payments_Subscriptions_Update_Column {
  /** column name */
  BillingAnchorDate = "billing_anchor_date",
  /** column name */
  BillingRetryCount = "billing_retry_count",
  /** column name */
  CancelAtPeriodEnd = "cancel_at_period_end",
  /** column name */
  CanceledAt = "canceled_at",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  CurrentPeriodEnd = "current_period_end",
  /** column name */
  CurrentPeriodStart = "current_period_start",
  /** column name */
  EndedAt = "ended_at",
  /** column name */
  ExternalSubscriptionId = "external_subscription_id",
  /** column name */
  Id = "id",
  /** column name */
  LastBillingDate = "last_billing_date",
  /** column name */
  MaxBillingRetries = "max_billing_retries",
  /** column name */
  Metadata = "metadata",
  /** column name */
  MethodId = "method_id",
  /** column name */
  NextBillingDate = "next_billing_date",
  /** column name */
  ObjectHid = "object_hid",
  /** column name */
  PlanId = "plan_id",
  /** column name */
  ProviderId = "provider_id",
  /** column name */
  Status = "status",
  /** column name */
  TrialEndsAt = "trial_ends_at",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Payments_Subscriptions_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Payments_Subscriptions_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Payments_Subscriptions_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Payments_Subscriptions_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Payments_Subscriptions_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Payments_Subscriptions_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Payments_Subscriptions_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Payments_Subscriptions_Set_Input>;
  /** filter the rows which have to be updated */
  where: Payments_Subscriptions_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Payments_Subscriptions_Var_Pop_Fields = {
  __typename?: "payments_subscriptions_var_pop_fields";
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: Maybe<Scalars["Float"]["output"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: Maybe<Scalars["Float"]["output"]>;
  /** Cancellation timestamp */
  canceled_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Current period end */
  current_period_end?: Maybe<Scalars["Float"]["output"]>;
  /** Current period start */
  current_period_start?: Maybe<Scalars["Float"]["output"]>;
  /** End timestamp */
  ended_at?: Maybe<Scalars["Float"]["output"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: Maybe<Scalars["Float"]["output"]>;
  /** Next billing date timestamp */
  next_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Trial end timestamp */
  trial_ends_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "payments.subscriptions" */
export type Payments_Subscriptions_Var_Pop_Order_By = {
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Order_By>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Order_By>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Current period end */
  current_period_end?: InputMaybe<Order_By>;
  /** Current period start */
  current_period_start?: InputMaybe<Order_By>;
  /** End timestamp */
  ended_at?: InputMaybe<Order_By>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Order_By>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Order_By>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Order_By>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Payments_Subscriptions_Var_Samp_Fields = {
  __typename?: "payments_subscriptions_var_samp_fields";
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: Maybe<Scalars["Float"]["output"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: Maybe<Scalars["Float"]["output"]>;
  /** Cancellation timestamp */
  canceled_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Current period end */
  current_period_end?: Maybe<Scalars["Float"]["output"]>;
  /** Current period start */
  current_period_start?: Maybe<Scalars["Float"]["output"]>;
  /** End timestamp */
  ended_at?: Maybe<Scalars["Float"]["output"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: Maybe<Scalars["Float"]["output"]>;
  /** Next billing date timestamp */
  next_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Trial end timestamp */
  trial_ends_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "payments.subscriptions" */
export type Payments_Subscriptions_Var_Samp_Order_By = {
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Order_By>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Order_By>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Current period end */
  current_period_end?: InputMaybe<Order_By>;
  /** Current period start */
  current_period_start?: InputMaybe<Order_By>;
  /** End timestamp */
  ended_at?: InputMaybe<Order_By>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Order_By>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Order_By>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Order_By>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Payments_Subscriptions_Variance_Fields = {
  __typename?: "payments_subscriptions_variance_fields";
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: Maybe<Scalars["Float"]["output"]>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: Maybe<Scalars["Float"]["output"]>;
  /** Cancellation timestamp */
  canceled_at?: Maybe<Scalars["Float"]["output"]>;
  created_at?: Maybe<Scalars["Float"]["output"]>;
  /** Current period end */
  current_period_end?: Maybe<Scalars["Float"]["output"]>;
  /** Current period start */
  current_period_start?: Maybe<Scalars["Float"]["output"]>;
  /** End timestamp */
  ended_at?: Maybe<Scalars["Float"]["output"]>;
  /** Last successful billing date timestamp */
  last_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: Maybe<Scalars["Float"]["output"]>;
  /** Next billing date timestamp */
  next_billing_date?: Maybe<Scalars["Float"]["output"]>;
  /** Trial end timestamp */
  trial_ends_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "payments.subscriptions" */
export type Payments_Subscriptions_Variance_Order_By = {
  /** Anchor date for billing cycle calculations */
  billing_anchor_date?: InputMaybe<Order_By>;
  /** Number of failed billing attempts for current period */
  billing_retry_count?: InputMaybe<Order_By>;
  /** Cancellation timestamp */
  canceled_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  /** Current period end */
  current_period_end?: InputMaybe<Order_By>;
  /** Current period start */
  current_period_start?: InputMaybe<Order_By>;
  /** End timestamp */
  ended_at?: InputMaybe<Order_By>;
  /** Last successful billing date timestamp */
  last_billing_date?: InputMaybe<Order_By>;
  /** Maximum number of billing retry attempts */
  max_billing_retries?: InputMaybe<Order_By>;
  /** Next billing date timestamp */
  next_billing_date?: InputMaybe<Order_By>;
  /** Trial end timestamp */
  trial_ends_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings = {
  __typename?: "payments_user_payment_provider_mappings";
  created_at: Scalars["bigint"]["output"];
  id: Scalars["uuid"]["output"];
  /** Mapping metadata */
  metadata?: Maybe<Scalars["jsonb"]["output"]>;
  /** An object relationship */
  provider: Payments_Providers;
  /** Provider customer key */
  provider_customer_key: Scalars["String"]["output"];
  /** Provider ID */
  provider_id: Scalars["uuid"]["output"];
  updated_at: Scalars["bigint"]["output"];
  /** An object relationship */
  user: Users;
  /** User ID */
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_MappingsMetadataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Aggregate = {
  __typename?: "payments_user_payment_provider_mappings_aggregate";
  aggregate?: Maybe<Payments_User_Payment_Provider_Mappings_Aggregate_Fields>;
  nodes: Array<Payments_User_Payment_Provider_Mappings>;
};

export type Payments_User_Payment_Provider_Mappings_Aggregate_Bool_Exp = {
  count?: InputMaybe<Payments_User_Payment_Provider_Mappings_Aggregate_Bool_Exp_Count>;
};

export type Payments_User_Payment_Provider_Mappings_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<
    Array<Payments_User_Payment_Provider_Mappings_Select_Column>
  >;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Payments_User_Payment_Provider_Mappings_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Aggregate_Fields = {
  __typename?: "payments_user_payment_provider_mappings_aggregate_fields";
  avg?: Maybe<Payments_User_Payment_Provider_Mappings_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Payments_User_Payment_Provider_Mappings_Max_Fields>;
  min?: Maybe<Payments_User_Payment_Provider_Mappings_Min_Fields>;
  stddev?: Maybe<Payments_User_Payment_Provider_Mappings_Stddev_Fields>;
  stddev_pop?: Maybe<Payments_User_Payment_Provider_Mappings_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Payments_User_Payment_Provider_Mappings_Stddev_Samp_Fields>;
  sum?: Maybe<Payments_User_Payment_Provider_Mappings_Sum_Fields>;
  var_pop?: Maybe<Payments_User_Payment_Provider_Mappings_Var_Pop_Fields>;
  var_samp?: Maybe<Payments_User_Payment_Provider_Mappings_Var_Samp_Fields>;
  variance?: Maybe<Payments_User_Payment_Provider_Mappings_Variance_Fields>;
};

/** aggregate fields of "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Aggregate_FieldsCountArgs =
  {
    columns?: InputMaybe<
      Array<Payments_User_Payment_Provider_Mappings_Select_Column>
    >;
    distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  };

/** order by aggregate values of table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Aggregate_Order_By = {
  avg?: InputMaybe<Payments_User_Payment_Provider_Mappings_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Payments_User_Payment_Provider_Mappings_Max_Order_By>;
  min?: InputMaybe<Payments_User_Payment_Provider_Mappings_Min_Order_By>;
  stddev?: InputMaybe<Payments_User_Payment_Provider_Mappings_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Payments_User_Payment_Provider_Mappings_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Payments_User_Payment_Provider_Mappings_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Payments_User_Payment_Provider_Mappings_Sum_Order_By>;
  var_pop?: InputMaybe<Payments_User_Payment_Provider_Mappings_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Payments_User_Payment_Provider_Mappings_Var_Samp_Order_By>;
  variance?: InputMaybe<Payments_User_Payment_Provider_Mappings_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Payments_User_Payment_Provider_Mappings_Append_Input = {
  /** Mapping metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Arr_Rel_Insert_Input = {
  data: Array<Payments_User_Payment_Provider_Mappings_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Payments_User_Payment_Provider_Mappings_On_Conflict>;
};

/** aggregate avg on columns */
export type Payments_User_Payment_Provider_Mappings_Avg_Fields = {
  __typename?: "payments_user_payment_provider_mappings_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Avg_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "payments.user_payment_provider_mappings". All fields are combined with a logical 'AND'. */
export type Payments_User_Payment_Provider_Mappings_Bool_Exp = {
  _and?: InputMaybe<Array<Payments_User_Payment_Provider_Mappings_Bool_Exp>>;
  _not?: InputMaybe<Payments_User_Payment_Provider_Mappings_Bool_Exp>;
  _or?: InputMaybe<Array<Payments_User_Payment_Provider_Mappings_Bool_Exp>>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  provider?: InputMaybe<Payments_Providers_Bool_Exp>;
  provider_customer_key?: InputMaybe<String_Comparison_Exp>;
  provider_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "payments.user_payment_provider_mappings" */
export enum Payments_User_Payment_Provider_Mappings_Constraint {
  /** unique or primary key constraint on columns "id" */
  UserPaymentProviderMappingsPkey = "user_payment_provider_mappings_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Payments_User_Payment_Provider_Mappings_Delete_At_Path_Input = {
  /** Mapping metadata */
  metadata?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Payments_User_Payment_Provider_Mappings_Delete_Elem_Input = {
  /** Mapping metadata */
  metadata?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Payments_User_Payment_Provider_Mappings_Delete_Key_Input = {
  /** Mapping metadata */
  metadata?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Insert_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Mapping metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  provider?: InputMaybe<Payments_Providers_Obj_Rel_Insert_Input>;
  /** Provider customer key */
  provider_customer_key?: InputMaybe<Scalars["String"]["input"]>;
  /** Provider ID */
  provider_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  /** User ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Payments_User_Payment_Provider_Mappings_Max_Fields = {
  __typename?: "payments_user_payment_provider_mappings_max_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Provider customer key */
  provider_customer_key?: Maybe<Scalars["String"]["output"]>;
  /** Provider ID */
  provider_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Provider customer key */
  provider_customer_key?: InputMaybe<Order_By>;
  /** Provider ID */
  provider_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** User ID */
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Payments_User_Payment_Provider_Mappings_Min_Fields = {
  __typename?: "payments_user_payment_provider_mappings_min_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Provider customer key */
  provider_customer_key?: Maybe<Scalars["String"]["output"]>;
  /** Provider ID */
  provider_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
  /** User ID */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Provider customer key */
  provider_customer_key?: InputMaybe<Order_By>;
  /** Provider ID */
  provider_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** User ID */
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Mutation_Response = {
  __typename?: "payments_user_payment_provider_mappings_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Payments_User_Payment_Provider_Mappings>;
};

/** on_conflict condition type for table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_On_Conflict = {
  constraint: Payments_User_Payment_Provider_Mappings_Constraint;
  update_columns?: Array<Payments_User_Payment_Provider_Mappings_Update_Column>;
  where?: InputMaybe<Payments_User_Payment_Provider_Mappings_Bool_Exp>;
};

/** Ordering options when selecting data from "payments.user_payment_provider_mappings". */
export type Payments_User_Payment_Provider_Mappings_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  provider?: InputMaybe<Payments_Providers_Order_By>;
  provider_customer_key?: InputMaybe<Order_By>;
  provider_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: payments.user_payment_provider_mappings */
export type Payments_User_Payment_Provider_Mappings_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Payments_User_Payment_Provider_Mappings_Prepend_Input = {
  /** Mapping metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "payments.user_payment_provider_mappings" */
export enum Payments_User_Payment_Provider_Mappings_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  Metadata = "metadata",
  /** column name */
  ProviderCustomerKey = "provider_customer_key",
  /** column name */
  ProviderId = "provider_id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Mapping metadata */
  metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** Provider customer key */
  provider_customer_key?: InputMaybe<Scalars["String"]["input"]>;
  /** Provider ID */
  provider_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  /** User ID */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Payments_User_Payment_Provider_Mappings_Stddev_Fields = {
  __typename?: "payments_user_payment_provider_mappings_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Stddev_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Payments_User_Payment_Provider_Mappings_Stddev_Pop_Fields = {
  __typename?: "payments_user_payment_provider_mappings_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Stddev_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Payments_User_Payment_Provider_Mappings_Stddev_Samp_Fields = {
  __typename?: "payments_user_payment_provider_mappings_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Stddev_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "payments_user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Payments_User_Payment_Provider_Mappings_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Payments_User_Payment_Provider_Mappings_Stream_Cursor_Value_Input =
  {
    created_at?: InputMaybe<Scalars["bigint"]["input"]>;
    id?: InputMaybe<Scalars["uuid"]["input"]>;
    /** Mapping metadata */
    metadata?: InputMaybe<Scalars["jsonb"]["input"]>;
    /** Provider customer key */
    provider_customer_key?: InputMaybe<Scalars["String"]["input"]>;
    /** Provider ID */
    provider_id?: InputMaybe<Scalars["uuid"]["input"]>;
    updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
    /** User ID */
    user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  };

/** aggregate sum on columns */
export type Payments_User_Payment_Provider_Mappings_Sum_Fields = {
  __typename?: "payments_user_payment_provider_mappings_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** order by sum() on columns of table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Sum_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** update columns of table "payments.user_payment_provider_mappings" */
export enum Payments_User_Payment_Provider_Mappings_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  Metadata = "metadata",
  /** column name */
  ProviderCustomerKey = "provider_customer_key",
  /** column name */
  ProviderId = "provider_id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Payments_User_Payment_Provider_Mappings_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Payments_User_Payment_Provider_Mappings_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Payments_User_Payment_Provider_Mappings_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Payments_User_Payment_Provider_Mappings_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Payments_User_Payment_Provider_Mappings_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Payments_User_Payment_Provider_Mappings_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Payments_User_Payment_Provider_Mappings_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Payments_User_Payment_Provider_Mappings_Set_Input>;
  /** filter the rows which have to be updated */
  where: Payments_User_Payment_Provider_Mappings_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Payments_User_Payment_Provider_Mappings_Var_Pop_Fields = {
  __typename?: "payments_user_payment_provider_mappings_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Var_Pop_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Payments_User_Payment_Provider_Mappings_Var_Samp_Fields = {
  __typename?: "payments_user_payment_provider_mappings_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Var_Samp_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Payments_User_Payment_Provider_Mappings_Variance_Fields = {
  __typename?: "payments_user_payment_provider_mappings_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "payments.user_payment_provider_mappings" */
export type Payments_User_Payment_Provider_Mappings_Variance_Order_By = {
  created_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** columns and relationships of "progress_metrics" */
export type Progress_Metrics = {
  __typename?: "progress_metrics";
  accuracy_grammar?: Maybe<Scalars["numeric"]["output"]>;
  accuracy_listening?: Maybe<Scalars["numeric"]["output"]>;
  accuracy_reading?: Maybe<Scalars["numeric"]["output"]>;
  accuracy_vocabulary?: Maybe<Scalars["numeric"]["output"]>;
  accuracy_writing?: Maybe<Scalars["numeric"]["output"]>;
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  date?: Maybe<Scalars["date"]["output"]>;
  id: Scalars["uuid"]["output"];
  study_minutes?: Maybe<Scalars["Int"]["output"]>;
  tasks_completed?: Maybe<Scalars["Int"]["output"]>;
  /** An object relationship */
  user?: Maybe<Users>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
  words_learned?: Maybe<Scalars["Int"]["output"]>;
};

/** aggregated selection of "progress_metrics" */
export type Progress_Metrics_Aggregate = {
  __typename?: "progress_metrics_aggregate";
  aggregate?: Maybe<Progress_Metrics_Aggregate_Fields>;
  nodes: Array<Progress_Metrics>;
};

export type Progress_Metrics_Aggregate_Bool_Exp = {
  count?: InputMaybe<Progress_Metrics_Aggregate_Bool_Exp_Count>;
};

export type Progress_Metrics_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Progress_Metrics_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Progress_Metrics_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "progress_metrics" */
export type Progress_Metrics_Aggregate_Fields = {
  __typename?: "progress_metrics_aggregate_fields";
  avg?: Maybe<Progress_Metrics_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Progress_Metrics_Max_Fields>;
  min?: Maybe<Progress_Metrics_Min_Fields>;
  stddev?: Maybe<Progress_Metrics_Stddev_Fields>;
  stddev_pop?: Maybe<Progress_Metrics_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Progress_Metrics_Stddev_Samp_Fields>;
  sum?: Maybe<Progress_Metrics_Sum_Fields>;
  var_pop?: Maybe<Progress_Metrics_Var_Pop_Fields>;
  var_samp?: Maybe<Progress_Metrics_Var_Samp_Fields>;
  variance?: Maybe<Progress_Metrics_Variance_Fields>;
};

/** aggregate fields of "progress_metrics" */
export type Progress_Metrics_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Progress_Metrics_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "progress_metrics" */
export type Progress_Metrics_Aggregate_Order_By = {
  avg?: InputMaybe<Progress_Metrics_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Progress_Metrics_Max_Order_By>;
  min?: InputMaybe<Progress_Metrics_Min_Order_By>;
  stddev?: InputMaybe<Progress_Metrics_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Progress_Metrics_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Progress_Metrics_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Progress_Metrics_Sum_Order_By>;
  var_pop?: InputMaybe<Progress_Metrics_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Progress_Metrics_Var_Samp_Order_By>;
  variance?: InputMaybe<Progress_Metrics_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "progress_metrics" */
export type Progress_Metrics_Arr_Rel_Insert_Input = {
  data: Array<Progress_Metrics_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Progress_Metrics_On_Conflict>;
};

/** aggregate avg on columns */
export type Progress_Metrics_Avg_Fields = {
  __typename?: "progress_metrics_avg_fields";
  accuracy_grammar?: Maybe<Scalars["Float"]["output"]>;
  accuracy_listening?: Maybe<Scalars["Float"]["output"]>;
  accuracy_reading?: Maybe<Scalars["Float"]["output"]>;
  accuracy_vocabulary?: Maybe<Scalars["Float"]["output"]>;
  accuracy_writing?: Maybe<Scalars["Float"]["output"]>;
  study_minutes?: Maybe<Scalars["Float"]["output"]>;
  tasks_completed?: Maybe<Scalars["Float"]["output"]>;
  words_learned?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "progress_metrics" */
export type Progress_Metrics_Avg_Order_By = {
  accuracy_grammar?: InputMaybe<Order_By>;
  accuracy_listening?: InputMaybe<Order_By>;
  accuracy_reading?: InputMaybe<Order_By>;
  accuracy_vocabulary?: InputMaybe<Order_By>;
  accuracy_writing?: InputMaybe<Order_By>;
  study_minutes?: InputMaybe<Order_By>;
  tasks_completed?: InputMaybe<Order_By>;
  words_learned?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "progress_metrics". All fields are combined with a logical 'AND'. */
export type Progress_Metrics_Bool_Exp = {
  _and?: InputMaybe<Array<Progress_Metrics_Bool_Exp>>;
  _not?: InputMaybe<Progress_Metrics_Bool_Exp>;
  _or?: InputMaybe<Array<Progress_Metrics_Bool_Exp>>;
  accuracy_grammar?: InputMaybe<Numeric_Comparison_Exp>;
  accuracy_listening?: InputMaybe<Numeric_Comparison_Exp>;
  accuracy_reading?: InputMaybe<Numeric_Comparison_Exp>;
  accuracy_vocabulary?: InputMaybe<Numeric_Comparison_Exp>;
  accuracy_writing?: InputMaybe<Numeric_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  date?: InputMaybe<Date_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  study_minutes?: InputMaybe<Int_Comparison_Exp>;
  tasks_completed?: InputMaybe<Int_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
  words_learned?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "progress_metrics" */
export enum Progress_Metrics_Constraint {
  /** unique or primary key constraint on columns "id" */
  ProgressMetricsPkey = "progress_metrics_pkey",
  /** unique or primary key constraint on columns "user_id", "date" */
  ProgressMetricsUserIdDateKey = "progress_metrics_user_id_date_key",
}

/** input type for incrementing numeric columns in table "progress_metrics" */
export type Progress_Metrics_Inc_Input = {
  accuracy_grammar?: InputMaybe<Scalars["numeric"]["input"]>;
  accuracy_listening?: InputMaybe<Scalars["numeric"]["input"]>;
  accuracy_reading?: InputMaybe<Scalars["numeric"]["input"]>;
  accuracy_vocabulary?: InputMaybe<Scalars["numeric"]["input"]>;
  accuracy_writing?: InputMaybe<Scalars["numeric"]["input"]>;
  study_minutes?: InputMaybe<Scalars["Int"]["input"]>;
  tasks_completed?: InputMaybe<Scalars["Int"]["input"]>;
  words_learned?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "progress_metrics" */
export type Progress_Metrics_Insert_Input = {
  accuracy_grammar?: InputMaybe<Scalars["numeric"]["input"]>;
  accuracy_listening?: InputMaybe<Scalars["numeric"]["input"]>;
  accuracy_reading?: InputMaybe<Scalars["numeric"]["input"]>;
  accuracy_vocabulary?: InputMaybe<Scalars["numeric"]["input"]>;
  accuracy_writing?: InputMaybe<Scalars["numeric"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  date?: InputMaybe<Scalars["date"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  study_minutes?: InputMaybe<Scalars["Int"]["input"]>;
  tasks_completed?: InputMaybe<Scalars["Int"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  words_learned?: InputMaybe<Scalars["Int"]["input"]>;
};

/** aggregate max on columns */
export type Progress_Metrics_Max_Fields = {
  __typename?: "progress_metrics_max_fields";
  accuracy_grammar?: Maybe<Scalars["numeric"]["output"]>;
  accuracy_listening?: Maybe<Scalars["numeric"]["output"]>;
  accuracy_reading?: Maybe<Scalars["numeric"]["output"]>;
  accuracy_vocabulary?: Maybe<Scalars["numeric"]["output"]>;
  accuracy_writing?: Maybe<Scalars["numeric"]["output"]>;
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  date?: Maybe<Scalars["date"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  study_minutes?: Maybe<Scalars["Int"]["output"]>;
  tasks_completed?: Maybe<Scalars["Int"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
  words_learned?: Maybe<Scalars["Int"]["output"]>;
};

/** order by max() on columns of table "progress_metrics" */
export type Progress_Metrics_Max_Order_By = {
  accuracy_grammar?: InputMaybe<Order_By>;
  accuracy_listening?: InputMaybe<Order_By>;
  accuracy_reading?: InputMaybe<Order_By>;
  accuracy_vocabulary?: InputMaybe<Order_By>;
  accuracy_writing?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  study_minutes?: InputMaybe<Order_By>;
  tasks_completed?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
  words_learned?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Progress_Metrics_Min_Fields = {
  __typename?: "progress_metrics_min_fields";
  accuracy_grammar?: Maybe<Scalars["numeric"]["output"]>;
  accuracy_listening?: Maybe<Scalars["numeric"]["output"]>;
  accuracy_reading?: Maybe<Scalars["numeric"]["output"]>;
  accuracy_vocabulary?: Maybe<Scalars["numeric"]["output"]>;
  accuracy_writing?: Maybe<Scalars["numeric"]["output"]>;
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  date?: Maybe<Scalars["date"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  study_minutes?: Maybe<Scalars["Int"]["output"]>;
  tasks_completed?: Maybe<Scalars["Int"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
  words_learned?: Maybe<Scalars["Int"]["output"]>;
};

/** order by min() on columns of table "progress_metrics" */
export type Progress_Metrics_Min_Order_By = {
  accuracy_grammar?: InputMaybe<Order_By>;
  accuracy_listening?: InputMaybe<Order_By>;
  accuracy_reading?: InputMaybe<Order_By>;
  accuracy_vocabulary?: InputMaybe<Order_By>;
  accuracy_writing?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  study_minutes?: InputMaybe<Order_By>;
  tasks_completed?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
  words_learned?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "progress_metrics" */
export type Progress_Metrics_Mutation_Response = {
  __typename?: "progress_metrics_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Progress_Metrics>;
};

/** on_conflict condition type for table "progress_metrics" */
export type Progress_Metrics_On_Conflict = {
  constraint: Progress_Metrics_Constraint;
  update_columns?: Array<Progress_Metrics_Update_Column>;
  where?: InputMaybe<Progress_Metrics_Bool_Exp>;
};

/** Ordering options when selecting data from "progress_metrics". */
export type Progress_Metrics_Order_By = {
  accuracy_grammar?: InputMaybe<Order_By>;
  accuracy_listening?: InputMaybe<Order_By>;
  accuracy_reading?: InputMaybe<Order_By>;
  accuracy_vocabulary?: InputMaybe<Order_By>;
  accuracy_writing?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  study_minutes?: InputMaybe<Order_By>;
  tasks_completed?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
  words_learned?: InputMaybe<Order_By>;
};

/** primary key columns input for table: progress_metrics */
export type Progress_Metrics_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "progress_metrics" */
export enum Progress_Metrics_Select_Column {
  /** column name */
  AccuracyGrammar = "accuracy_grammar",
  /** column name */
  AccuracyListening = "accuracy_listening",
  /** column name */
  AccuracyReading = "accuracy_reading",
  /** column name */
  AccuracyVocabulary = "accuracy_vocabulary",
  /** column name */
  AccuracyWriting = "accuracy_writing",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Date = "date",
  /** column name */
  Id = "id",
  /** column name */
  StudyMinutes = "study_minutes",
  /** column name */
  TasksCompleted = "tasks_completed",
  /** column name */
  UserId = "user_id",
  /** column name */
  WordsLearned = "words_learned",
}

/** input type for updating data in table "progress_metrics" */
export type Progress_Metrics_Set_Input = {
  accuracy_grammar?: InputMaybe<Scalars["numeric"]["input"]>;
  accuracy_listening?: InputMaybe<Scalars["numeric"]["input"]>;
  accuracy_reading?: InputMaybe<Scalars["numeric"]["input"]>;
  accuracy_vocabulary?: InputMaybe<Scalars["numeric"]["input"]>;
  accuracy_writing?: InputMaybe<Scalars["numeric"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  date?: InputMaybe<Scalars["date"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  study_minutes?: InputMaybe<Scalars["Int"]["input"]>;
  tasks_completed?: InputMaybe<Scalars["Int"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  words_learned?: InputMaybe<Scalars["Int"]["input"]>;
};

/** aggregate stddev on columns */
export type Progress_Metrics_Stddev_Fields = {
  __typename?: "progress_metrics_stddev_fields";
  accuracy_grammar?: Maybe<Scalars["Float"]["output"]>;
  accuracy_listening?: Maybe<Scalars["Float"]["output"]>;
  accuracy_reading?: Maybe<Scalars["Float"]["output"]>;
  accuracy_vocabulary?: Maybe<Scalars["Float"]["output"]>;
  accuracy_writing?: Maybe<Scalars["Float"]["output"]>;
  study_minutes?: Maybe<Scalars["Float"]["output"]>;
  tasks_completed?: Maybe<Scalars["Float"]["output"]>;
  words_learned?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "progress_metrics" */
export type Progress_Metrics_Stddev_Order_By = {
  accuracy_grammar?: InputMaybe<Order_By>;
  accuracy_listening?: InputMaybe<Order_By>;
  accuracy_reading?: InputMaybe<Order_By>;
  accuracy_vocabulary?: InputMaybe<Order_By>;
  accuracy_writing?: InputMaybe<Order_By>;
  study_minutes?: InputMaybe<Order_By>;
  tasks_completed?: InputMaybe<Order_By>;
  words_learned?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Progress_Metrics_Stddev_Pop_Fields = {
  __typename?: "progress_metrics_stddev_pop_fields";
  accuracy_grammar?: Maybe<Scalars["Float"]["output"]>;
  accuracy_listening?: Maybe<Scalars["Float"]["output"]>;
  accuracy_reading?: Maybe<Scalars["Float"]["output"]>;
  accuracy_vocabulary?: Maybe<Scalars["Float"]["output"]>;
  accuracy_writing?: Maybe<Scalars["Float"]["output"]>;
  study_minutes?: Maybe<Scalars["Float"]["output"]>;
  tasks_completed?: Maybe<Scalars["Float"]["output"]>;
  words_learned?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "progress_metrics" */
export type Progress_Metrics_Stddev_Pop_Order_By = {
  accuracy_grammar?: InputMaybe<Order_By>;
  accuracy_listening?: InputMaybe<Order_By>;
  accuracy_reading?: InputMaybe<Order_By>;
  accuracy_vocabulary?: InputMaybe<Order_By>;
  accuracy_writing?: InputMaybe<Order_By>;
  study_minutes?: InputMaybe<Order_By>;
  tasks_completed?: InputMaybe<Order_By>;
  words_learned?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Progress_Metrics_Stddev_Samp_Fields = {
  __typename?: "progress_metrics_stddev_samp_fields";
  accuracy_grammar?: Maybe<Scalars["Float"]["output"]>;
  accuracy_listening?: Maybe<Scalars["Float"]["output"]>;
  accuracy_reading?: Maybe<Scalars["Float"]["output"]>;
  accuracy_vocabulary?: Maybe<Scalars["Float"]["output"]>;
  accuracy_writing?: Maybe<Scalars["Float"]["output"]>;
  study_minutes?: Maybe<Scalars["Float"]["output"]>;
  tasks_completed?: Maybe<Scalars["Float"]["output"]>;
  words_learned?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "progress_metrics" */
export type Progress_Metrics_Stddev_Samp_Order_By = {
  accuracy_grammar?: InputMaybe<Order_By>;
  accuracy_listening?: InputMaybe<Order_By>;
  accuracy_reading?: InputMaybe<Order_By>;
  accuracy_vocabulary?: InputMaybe<Order_By>;
  accuracy_writing?: InputMaybe<Order_By>;
  study_minutes?: InputMaybe<Order_By>;
  tasks_completed?: InputMaybe<Order_By>;
  words_learned?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "progress_metrics" */
export type Progress_Metrics_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Progress_Metrics_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Progress_Metrics_Stream_Cursor_Value_Input = {
  accuracy_grammar?: InputMaybe<Scalars["numeric"]["input"]>;
  accuracy_listening?: InputMaybe<Scalars["numeric"]["input"]>;
  accuracy_reading?: InputMaybe<Scalars["numeric"]["input"]>;
  accuracy_vocabulary?: InputMaybe<Scalars["numeric"]["input"]>;
  accuracy_writing?: InputMaybe<Scalars["numeric"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  date?: InputMaybe<Scalars["date"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  study_minutes?: InputMaybe<Scalars["Int"]["input"]>;
  tasks_completed?: InputMaybe<Scalars["Int"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  words_learned?: InputMaybe<Scalars["Int"]["input"]>;
};

/** aggregate sum on columns */
export type Progress_Metrics_Sum_Fields = {
  __typename?: "progress_metrics_sum_fields";
  accuracy_grammar?: Maybe<Scalars["numeric"]["output"]>;
  accuracy_listening?: Maybe<Scalars["numeric"]["output"]>;
  accuracy_reading?: Maybe<Scalars["numeric"]["output"]>;
  accuracy_vocabulary?: Maybe<Scalars["numeric"]["output"]>;
  accuracy_writing?: Maybe<Scalars["numeric"]["output"]>;
  study_minutes?: Maybe<Scalars["Int"]["output"]>;
  tasks_completed?: Maybe<Scalars["Int"]["output"]>;
  words_learned?: Maybe<Scalars["Int"]["output"]>;
};

/** order by sum() on columns of table "progress_metrics" */
export type Progress_Metrics_Sum_Order_By = {
  accuracy_grammar?: InputMaybe<Order_By>;
  accuracy_listening?: InputMaybe<Order_By>;
  accuracy_reading?: InputMaybe<Order_By>;
  accuracy_vocabulary?: InputMaybe<Order_By>;
  accuracy_writing?: InputMaybe<Order_By>;
  study_minutes?: InputMaybe<Order_By>;
  tasks_completed?: InputMaybe<Order_By>;
  words_learned?: InputMaybe<Order_By>;
};

/** update columns of table "progress_metrics" */
export enum Progress_Metrics_Update_Column {
  /** column name */
  AccuracyGrammar = "accuracy_grammar",
  /** column name */
  AccuracyListening = "accuracy_listening",
  /** column name */
  AccuracyReading = "accuracy_reading",
  /** column name */
  AccuracyVocabulary = "accuracy_vocabulary",
  /** column name */
  AccuracyWriting = "accuracy_writing",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Date = "date",
  /** column name */
  Id = "id",
  /** column name */
  StudyMinutes = "study_minutes",
  /** column name */
  TasksCompleted = "tasks_completed",
  /** column name */
  UserId = "user_id",
  /** column name */
  WordsLearned = "words_learned",
}

export type Progress_Metrics_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Progress_Metrics_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Progress_Metrics_Set_Input>;
  /** filter the rows which have to be updated */
  where: Progress_Metrics_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Progress_Metrics_Var_Pop_Fields = {
  __typename?: "progress_metrics_var_pop_fields";
  accuracy_grammar?: Maybe<Scalars["Float"]["output"]>;
  accuracy_listening?: Maybe<Scalars["Float"]["output"]>;
  accuracy_reading?: Maybe<Scalars["Float"]["output"]>;
  accuracy_vocabulary?: Maybe<Scalars["Float"]["output"]>;
  accuracy_writing?: Maybe<Scalars["Float"]["output"]>;
  study_minutes?: Maybe<Scalars["Float"]["output"]>;
  tasks_completed?: Maybe<Scalars["Float"]["output"]>;
  words_learned?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "progress_metrics" */
export type Progress_Metrics_Var_Pop_Order_By = {
  accuracy_grammar?: InputMaybe<Order_By>;
  accuracy_listening?: InputMaybe<Order_By>;
  accuracy_reading?: InputMaybe<Order_By>;
  accuracy_vocabulary?: InputMaybe<Order_By>;
  accuracy_writing?: InputMaybe<Order_By>;
  study_minutes?: InputMaybe<Order_By>;
  tasks_completed?: InputMaybe<Order_By>;
  words_learned?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Progress_Metrics_Var_Samp_Fields = {
  __typename?: "progress_metrics_var_samp_fields";
  accuracy_grammar?: Maybe<Scalars["Float"]["output"]>;
  accuracy_listening?: Maybe<Scalars["Float"]["output"]>;
  accuracy_reading?: Maybe<Scalars["Float"]["output"]>;
  accuracy_vocabulary?: Maybe<Scalars["Float"]["output"]>;
  accuracy_writing?: Maybe<Scalars["Float"]["output"]>;
  study_minutes?: Maybe<Scalars["Float"]["output"]>;
  tasks_completed?: Maybe<Scalars["Float"]["output"]>;
  words_learned?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "progress_metrics" */
export type Progress_Metrics_Var_Samp_Order_By = {
  accuracy_grammar?: InputMaybe<Order_By>;
  accuracy_listening?: InputMaybe<Order_By>;
  accuracy_reading?: InputMaybe<Order_By>;
  accuracy_vocabulary?: InputMaybe<Order_By>;
  accuracy_writing?: InputMaybe<Order_By>;
  study_minutes?: InputMaybe<Order_By>;
  tasks_completed?: InputMaybe<Order_By>;
  words_learned?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Progress_Metrics_Variance_Fields = {
  __typename?: "progress_metrics_variance_fields";
  accuracy_grammar?: Maybe<Scalars["Float"]["output"]>;
  accuracy_listening?: Maybe<Scalars["Float"]["output"]>;
  accuracy_reading?: Maybe<Scalars["Float"]["output"]>;
  accuracy_vocabulary?: Maybe<Scalars["Float"]["output"]>;
  accuracy_writing?: Maybe<Scalars["Float"]["output"]>;
  study_minutes?: Maybe<Scalars["Float"]["output"]>;
  tasks_completed?: Maybe<Scalars["Float"]["output"]>;
  words_learned?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "progress_metrics" */
export type Progress_Metrics_Variance_Order_By = {
  accuracy_grammar?: InputMaybe<Order_By>;
  accuracy_listening?: InputMaybe<Order_By>;
  accuracy_reading?: InputMaybe<Order_By>;
  accuracy_vocabulary?: InputMaybe<Order_By>;
  accuracy_writing?: InputMaybe<Order_By>;
  study_minutes?: InputMaybe<Order_By>;
  tasks_completed?: InputMaybe<Order_By>;
  words_learned?: InputMaybe<Order_By>;
};

export type Query_Root = {
  __typename?: "query_root";
  /** An array relationship */
  accounts: Array<Accounts>;
  /** An aggregate relationship */
  accounts_aggregate: Accounts_Aggregate;
  /** fetch data from the table: "accounts" using primary key columns */
  accounts_by_pk?: Maybe<Accounts>;
  /** An array relationship */
  achievements: Array<Achievements>;
  /** An aggregate relationship */
  achievements_aggregate: Achievements_Aggregate;
  /** fetch data from the table: "achievements" using primary key columns */
  achievements_by_pk?: Maybe<Achievements>;
  /** An array relationship */
  ai_sessions: Array<Ai_Sessions>;
  /** An aggregate relationship */
  ai_sessions_aggregate: Ai_Sessions_Aggregate;
  /** fetch data from the table: "ai_sessions" using primary key columns */
  ai_sessions_by_pk?: Maybe<Ai_Sessions>;
  /** fetch data from the table: "auth_jwt" */
  auth_jwt: Array<Auth_Jwt>;
  /** fetch aggregated fields from the table: "auth_jwt" */
  auth_jwt_aggregate: Auth_Jwt_Aggregate;
  /** fetch data from the table: "auth_jwt" using primary key columns */
  auth_jwt_by_pk?: Maybe<Auth_Jwt>;
  /** fetch data from the table: "storage.buckets" using primary key columns */
  bucket?: Maybe<Buckets>;
  /** fetch data from the table: "storage.buckets" */
  buckets: Array<Buckets>;
  /** fetch aggregated fields from the table: "storage.buckets" */
  bucketsAggregate: Buckets_Aggregate;
  /** An array relationship */
  daily_tasks: Array<Daily_Tasks>;
  /** An aggregate relationship */
  daily_tasks_aggregate: Daily_Tasks_Aggregate;
  /** fetch data from the table: "daily_tasks" using primary key columns */
  daily_tasks_by_pk?: Maybe<Daily_Tasks>;
  /** fetch data from the table: "debug" */
  debug: Array<Debug>;
  /** fetch aggregated fields from the table: "debug" */
  debug_aggregate: Debug_Aggregate;
  /** fetch data from the table: "debug" using primary key columns */
  debug_by_pk?: Maybe<Debug>;
  /** fetch data from the table: "error_log" */
  error_log: Array<Error_Log>;
  /** fetch aggregated fields from the table: "error_log" */
  error_log_aggregate: Error_Log_Aggregate;
  /** fetch data from the table: "error_log" using primary key columns */
  error_log_by_pk?: Maybe<Error_Log>;
  /** fetch data from the table: "storage.files" using primary key columns */
  file?: Maybe<Files>;
  /** fetch data from the table: "storage.files_blob" using primary key columns */
  fileBlob?: Maybe<FilesBlob>;
  /** An array relationship */
  files: Array<Files>;
  /** fetch aggregated fields from the table: "storage.files" */
  filesAggregate: Files_Aggregate;
  /** fetch aggregated fields from the table: "storage.files_blob" */
  filesBlob_aggregate: FilesBlob_Aggregate;
  /** fetch data from the table: "storage.files_blob" */
  filesBlobs: Array<FilesBlob>;
  /** fetch data from the table: "github_issues" */
  github_issues: Array<Github_Issues>;
  /** fetch aggregated fields from the table: "github_issues" */
  github_issues_aggregate: Github_Issues_Aggregate;
  /** fetch data from the table: "github_issues" using primary key columns */
  github_issues_by_pk?: Maybe<Github_Issues>;
  /** fetch data from the table: "invites" */
  invites: Array<Invites>;
  /** fetch aggregated fields from the table: "invites" */
  invites_aggregate: Invites_Aggregate;
  /** fetch data from the table: "invites" using primary key columns */
  invites_by_pk?: Maybe<Invites>;
  /** fetch data from the table: "logs.diffs" */
  logs_diffs: Array<Logs_Diffs>;
  /** fetch aggregated fields from the table: "logs.diffs" */
  logs_diffs_aggregate: Logs_Diffs_Aggregate;
  /** fetch data from the table: "logs.diffs" using primary key columns */
  logs_diffs_by_pk?: Maybe<Logs_Diffs>;
  /** An array relationship */
  notification_messages: Array<Notification_Messages>;
  /** An aggregate relationship */
  notification_messages_aggregate: Notification_Messages_Aggregate;
  /** fetch data from the table: "notification_messages" using primary key columns */
  notification_messages_by_pk?: Maybe<Notification_Messages>;
  /** An array relationship */
  notification_permissions: Array<Notification_Permissions>;
  /** An aggregate relationship */
  notification_permissions_aggregate: Notification_Permissions_Aggregate;
  /** fetch data from the table: "notification_permissions" using primary key columns */
  notification_permissions_by_pk?: Maybe<Notification_Permissions>;
  /** An array relationship */
  notifications: Array<Notifications>;
  /** An aggregate relationship */
  notifications_aggregate: Notifications_Aggregate;
  /** fetch data from the table: "notifications" using primary key columns */
  notifications_by_pk?: Maybe<Notifications>;
  /** fetch data from the table: "payments.methods" */
  payments_methods: Array<Payments_Methods>;
  /** fetch aggregated fields from the table: "payments.methods" */
  payments_methods_aggregate: Payments_Methods_Aggregate;
  /** fetch data from the table: "payments.methods" using primary key columns */
  payments_methods_by_pk?: Maybe<Payments_Methods>;
  /** fetch data from the table: "payments.operations" */
  payments_operations: Array<Payments_Operations>;
  /** fetch aggregated fields from the table: "payments.operations" */
  payments_operations_aggregate: Payments_Operations_Aggregate;
  /** fetch data from the table: "payments.operations" using primary key columns */
  payments_operations_by_pk?: Maybe<Payments_Operations>;
  /** fetch data from the table: "payments.plans" */
  payments_plans: Array<Payments_Plans>;
  /** fetch aggregated fields from the table: "payments.plans" */
  payments_plans_aggregate: Payments_Plans_Aggregate;
  /** fetch data from the table: "payments.plans" using primary key columns */
  payments_plans_by_pk?: Maybe<Payments_Plans>;
  /** fetch data from the table: "payments.providers" */
  payments_providers: Array<Payments_Providers>;
  /** fetch aggregated fields from the table: "payments.providers" */
  payments_providers_aggregate: Payments_Providers_Aggregate;
  /** fetch data from the table: "payments.providers" using primary key columns */
  payments_providers_by_pk?: Maybe<Payments_Providers>;
  /** fetch data from the table: "payments.subscriptions" */
  payments_subscriptions: Array<Payments_Subscriptions>;
  /** fetch aggregated fields from the table: "payments.subscriptions" */
  payments_subscriptions_aggregate: Payments_Subscriptions_Aggregate;
  /** fetch data from the table: "payments.subscriptions" using primary key columns */
  payments_subscriptions_by_pk?: Maybe<Payments_Subscriptions>;
  /** fetch data from the table: "payments.user_payment_provider_mappings" */
  payments_user_payment_provider_mappings: Array<Payments_User_Payment_Provider_Mappings>;
  /** fetch aggregated fields from the table: "payments.user_payment_provider_mappings" */
  payments_user_payment_provider_mappings_aggregate: Payments_User_Payment_Provider_Mappings_Aggregate;
  /** fetch data from the table: "payments.user_payment_provider_mappings" using primary key columns */
  payments_user_payment_provider_mappings_by_pk?: Maybe<Payments_User_Payment_Provider_Mappings>;
  /** An array relationship */
  progress_metrics: Array<Progress_Metrics>;
  /** An aggregate relationship */
  progress_metrics_aggregate: Progress_Metrics_Aggregate;
  /** fetch data from the table: "progress_metrics" using primary key columns */
  progress_metrics_by_pk?: Maybe<Progress_Metrics>;
  /** fetch data from the table: "review_history" */
  review_history: Array<Review_History>;
  /** fetch aggregated fields from the table: "review_history" */
  review_history_aggregate: Review_History_Aggregate;
  /** fetch data from the table: "review_history" using primary key columns */
  review_history_by_pk?: Maybe<Review_History>;
  /** fetch data from the table: "stage_progress" */
  stage_progress: Array<Stage_Progress>;
  /** fetch aggregated fields from the table: "stage_progress" */
  stage_progress_aggregate: Stage_Progress_Aggregate;
  /** fetch data from the table: "stage_progress" using primary key columns */
  stage_progress_by_pk?: Maybe<Stage_Progress>;
  /** An array relationship */
  stage_requirements: Array<Stage_Requirements>;
  /** An aggregate relationship */
  stage_requirements_aggregate: Stage_Requirements_Aggregate;
  /** fetch data from the table: "stage_requirements" using primary key columns */
  stage_requirements_by_pk?: Maybe<Stage_Requirements>;
  /** An array relationship */
  stage_tests: Array<Stage_Tests>;
  /** An aggregate relationship */
  stage_tests_aggregate: Stage_Tests_Aggregate;
  /** fetch data from the table: "stage_tests" using primary key columns */
  stage_tests_by_pk?: Maybe<Stage_Tests>;
  /** fetch data from the table: "streaks" */
  streaks: Array<Streaks>;
  /** fetch aggregated fields from the table: "streaks" */
  streaks_aggregate: Streaks_Aggregate;
  /** fetch data from the table: "streaks" using primary key columns */
  streaks_by_pk?: Maybe<Streaks>;
  /** fetch data from the table: "study_stages" */
  study_stages: Array<Study_Stages>;
  /** fetch aggregated fields from the table: "study_stages" */
  study_stages_aggregate: Study_Stages_Aggregate;
  /** fetch data from the table: "study_stages" using primary key columns */
  study_stages_by_pk?: Maybe<Study_Stages>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
  /** fetch data from the table: "verification_codes" */
  verification_codes: Array<Verification_Codes>;
  /** fetch aggregated fields from the table: "verification_codes" */
  verification_codes_aggregate: Verification_Codes_Aggregate;
  /** fetch data from the table: "verification_codes" using primary key columns */
  verification_codes_by_pk?: Maybe<Verification_Codes>;
  /** fetch data from the table: "storage.virus" using primary key columns */
  virus?: Maybe<Virus>;
  /** fetch data from the table: "storage.virus" */
  viruses: Array<Virus>;
  /** fetch aggregated fields from the table: "storage.virus" */
  virusesAggregate: Virus_Aggregate;
  /** An array relationship */
  vocabulary_cards: Array<Vocabulary_Cards>;
  /** An aggregate relationship */
  vocabulary_cards_aggregate: Vocabulary_Cards_Aggregate;
  /** fetch data from the table: "vocabulary_cards" using primary key columns */
  vocabulary_cards_by_pk?: Maybe<Vocabulary_Cards>;
  /** fetch data from the table: "weekly_structure" */
  weekly_structure: Array<Weekly_Structure>;
  /** fetch aggregated fields from the table: "weekly_structure" */
  weekly_structure_aggregate: Weekly_Structure_Aggregate;
  /** fetch data from the table: "weekly_structure" using primary key columns */
  weekly_structure_by_pk?: Maybe<Weekly_Structure>;
};

export type Query_RootAccountsArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};

export type Query_RootAccounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};

export type Query_RootAccounts_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootAchievementsArgs = {
  distinct_on?: InputMaybe<Array<Achievements_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Achievements_Order_By>>;
  where?: InputMaybe<Achievements_Bool_Exp>;
};

export type Query_RootAchievements_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Achievements_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Achievements_Order_By>>;
  where?: InputMaybe<Achievements_Bool_Exp>;
};

export type Query_RootAchievements_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootAi_SessionsArgs = {
  distinct_on?: InputMaybe<Array<Ai_Sessions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Ai_Sessions_Order_By>>;
  where?: InputMaybe<Ai_Sessions_Bool_Exp>;
};

export type Query_RootAi_Sessions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Ai_Sessions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Ai_Sessions_Order_By>>;
  where?: InputMaybe<Ai_Sessions_Bool_Exp>;
};

export type Query_RootAi_Sessions_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootAuth_JwtArgs = {
  distinct_on?: InputMaybe<Array<Auth_Jwt_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Jwt_Order_By>>;
  where?: InputMaybe<Auth_Jwt_Bool_Exp>;
};

export type Query_RootAuth_Jwt_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Auth_Jwt_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Jwt_Order_By>>;
  where?: InputMaybe<Auth_Jwt_Bool_Exp>;
};

export type Query_RootAuth_Jwt_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootBucketArgs = {
  id: Scalars["String"]["input"];
};

export type Query_RootBucketsArgs = {
  distinct_on?: InputMaybe<Array<Buckets_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Buckets_Order_By>>;
  where?: InputMaybe<Buckets_Bool_Exp>;
};

export type Query_RootBucketsAggregateArgs = {
  distinct_on?: InputMaybe<Array<Buckets_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Buckets_Order_By>>;
  where?: InputMaybe<Buckets_Bool_Exp>;
};

export type Query_RootDaily_TasksArgs = {
  distinct_on?: InputMaybe<Array<Daily_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Daily_Tasks_Order_By>>;
  where?: InputMaybe<Daily_Tasks_Bool_Exp>;
};

export type Query_RootDaily_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Daily_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Daily_Tasks_Order_By>>;
  where?: InputMaybe<Daily_Tasks_Bool_Exp>;
};

export type Query_RootDaily_Tasks_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootDebugArgs = {
  distinct_on?: InputMaybe<Array<Debug_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Debug_Order_By>>;
  where?: InputMaybe<Debug_Bool_Exp>;
};

export type Query_RootDebug_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Debug_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Debug_Order_By>>;
  where?: InputMaybe<Debug_Bool_Exp>;
};

export type Query_RootDebug_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootError_LogArgs = {
  distinct_on?: InputMaybe<Array<Error_Log_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Error_Log_Order_By>>;
  where?: InputMaybe<Error_Log_Bool_Exp>;
};

export type Query_RootError_Log_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Error_Log_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Error_Log_Order_By>>;
  where?: InputMaybe<Error_Log_Bool_Exp>;
};

export type Query_RootError_Log_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootFileArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootFileBlobArgs = {
  fileId: Scalars["uuid"]["input"];
};

export type Query_RootFilesArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};

export type Query_RootFilesAggregateArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};

export type Query_RootFilesBlob_AggregateArgs = {
  distinct_on?: InputMaybe<Array<FilesBlob_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<FilesBlob_Order_By>>;
  where?: InputMaybe<FilesBlob_Bool_Exp>;
};

export type Query_RootFilesBlobsArgs = {
  distinct_on?: InputMaybe<Array<FilesBlob_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<FilesBlob_Order_By>>;
  where?: InputMaybe<FilesBlob_Bool_Exp>;
};

export type Query_RootGithub_IssuesArgs = {
  distinct_on?: InputMaybe<Array<Github_Issues_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Github_Issues_Order_By>>;
  where?: InputMaybe<Github_Issues_Bool_Exp>;
};

export type Query_RootGithub_Issues_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Github_Issues_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Github_Issues_Order_By>>;
  where?: InputMaybe<Github_Issues_Bool_Exp>;
};

export type Query_RootGithub_Issues_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootInvitesArgs = {
  distinct_on?: InputMaybe<Array<Invites_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Invites_Order_By>>;
  where?: InputMaybe<Invites_Bool_Exp>;
};

export type Query_RootInvites_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invites_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Invites_Order_By>>;
  where?: InputMaybe<Invites_Bool_Exp>;
};

export type Query_RootInvites_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootLogs_DiffsArgs = {
  distinct_on?: InputMaybe<Array<Logs_Diffs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Logs_Diffs_Order_By>>;
  where?: InputMaybe<Logs_Diffs_Bool_Exp>;
};

export type Query_RootLogs_Diffs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Logs_Diffs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Logs_Diffs_Order_By>>;
  where?: InputMaybe<Logs_Diffs_Bool_Exp>;
};

export type Query_RootLogs_Diffs_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootNotification_MessagesArgs = {
  distinct_on?: InputMaybe<Array<Notification_Messages_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notification_Messages_Order_By>>;
  where?: InputMaybe<Notification_Messages_Bool_Exp>;
};

export type Query_RootNotification_Messages_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notification_Messages_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notification_Messages_Order_By>>;
  where?: InputMaybe<Notification_Messages_Bool_Exp>;
};

export type Query_RootNotification_Messages_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootNotification_PermissionsArgs = {
  distinct_on?: InputMaybe<Array<Notification_Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notification_Permissions_Order_By>>;
  where?: InputMaybe<Notification_Permissions_Bool_Exp>;
};

export type Query_RootNotification_Permissions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notification_Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notification_Permissions_Order_By>>;
  where?: InputMaybe<Notification_Permissions_Bool_Exp>;
};

export type Query_RootNotification_Permissions_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootNotificationsArgs = {
  distinct_on?: InputMaybe<Array<Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notifications_Order_By>>;
  where?: InputMaybe<Notifications_Bool_Exp>;
};

export type Query_RootNotifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notifications_Order_By>>;
  where?: InputMaybe<Notifications_Bool_Exp>;
};

export type Query_RootNotifications_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootPayments_MethodsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Methods_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Methods_Order_By>>;
  where?: InputMaybe<Payments_Methods_Bool_Exp>;
};

export type Query_RootPayments_Methods_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Methods_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Methods_Order_By>>;
  where?: InputMaybe<Payments_Methods_Bool_Exp>;
};

export type Query_RootPayments_Methods_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootPayments_OperationsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Operations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Operations_Order_By>>;
  where?: InputMaybe<Payments_Operations_Bool_Exp>;
};

export type Query_RootPayments_Operations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Operations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Operations_Order_By>>;
  where?: InputMaybe<Payments_Operations_Bool_Exp>;
};

export type Query_RootPayments_Operations_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootPayments_PlansArgs = {
  distinct_on?: InputMaybe<Array<Payments_Plans_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Plans_Order_By>>;
  where?: InputMaybe<Payments_Plans_Bool_Exp>;
};

export type Query_RootPayments_Plans_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Plans_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Plans_Order_By>>;
  where?: InputMaybe<Payments_Plans_Bool_Exp>;
};

export type Query_RootPayments_Plans_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootPayments_ProvidersArgs = {
  distinct_on?: InputMaybe<Array<Payments_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Providers_Order_By>>;
  where?: InputMaybe<Payments_Providers_Bool_Exp>;
};

export type Query_RootPayments_Providers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Providers_Order_By>>;
  where?: InputMaybe<Payments_Providers_Bool_Exp>;
};

export type Query_RootPayments_Providers_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootPayments_SubscriptionsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Subscriptions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Subscriptions_Order_By>>;
  where?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
};

export type Query_RootPayments_Subscriptions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Subscriptions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Subscriptions_Order_By>>;
  where?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
};

export type Query_RootPayments_Subscriptions_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootPayments_User_Payment_Provider_MappingsArgs = {
  distinct_on?: InputMaybe<
    Array<Payments_User_Payment_Provider_Mappings_Select_Column>
  >;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<
    Array<Payments_User_Payment_Provider_Mappings_Order_By>
  >;
  where?: InputMaybe<Payments_User_Payment_Provider_Mappings_Bool_Exp>;
};

export type Query_RootPayments_User_Payment_Provider_Mappings_AggregateArgs = {
  distinct_on?: InputMaybe<
    Array<Payments_User_Payment_Provider_Mappings_Select_Column>
  >;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<
    Array<Payments_User_Payment_Provider_Mappings_Order_By>
  >;
  where?: InputMaybe<Payments_User_Payment_Provider_Mappings_Bool_Exp>;
};

export type Query_RootPayments_User_Payment_Provider_Mappings_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootProgress_MetricsArgs = {
  distinct_on?: InputMaybe<Array<Progress_Metrics_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Progress_Metrics_Order_By>>;
  where?: InputMaybe<Progress_Metrics_Bool_Exp>;
};

export type Query_RootProgress_Metrics_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Progress_Metrics_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Progress_Metrics_Order_By>>;
  where?: InputMaybe<Progress_Metrics_Bool_Exp>;
};

export type Query_RootProgress_Metrics_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootReview_HistoryArgs = {
  distinct_on?: InputMaybe<Array<Review_History_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Review_History_Order_By>>;
  where?: InputMaybe<Review_History_Bool_Exp>;
};

export type Query_RootReview_History_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Review_History_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Review_History_Order_By>>;
  where?: InputMaybe<Review_History_Bool_Exp>;
};

export type Query_RootReview_History_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootStage_ProgressArgs = {
  distinct_on?: InputMaybe<Array<Stage_Progress_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Stage_Progress_Order_By>>;
  where?: InputMaybe<Stage_Progress_Bool_Exp>;
};

export type Query_RootStage_Progress_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Stage_Progress_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Stage_Progress_Order_By>>;
  where?: InputMaybe<Stage_Progress_Bool_Exp>;
};

export type Query_RootStage_Progress_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootStage_RequirementsArgs = {
  distinct_on?: InputMaybe<Array<Stage_Requirements_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Stage_Requirements_Order_By>>;
  where?: InputMaybe<Stage_Requirements_Bool_Exp>;
};

export type Query_RootStage_Requirements_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Stage_Requirements_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Stage_Requirements_Order_By>>;
  where?: InputMaybe<Stage_Requirements_Bool_Exp>;
};

export type Query_RootStage_Requirements_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootStage_TestsArgs = {
  distinct_on?: InputMaybe<Array<Stage_Tests_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Stage_Tests_Order_By>>;
  where?: InputMaybe<Stage_Tests_Bool_Exp>;
};

export type Query_RootStage_Tests_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Stage_Tests_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Stage_Tests_Order_By>>;
  where?: InputMaybe<Stage_Tests_Bool_Exp>;
};

export type Query_RootStage_Tests_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootStreaksArgs = {
  distinct_on?: InputMaybe<Array<Streaks_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Streaks_Order_By>>;
  where?: InputMaybe<Streaks_Bool_Exp>;
};

export type Query_RootStreaks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Streaks_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Streaks_Order_By>>;
  where?: InputMaybe<Streaks_Bool_Exp>;
};

export type Query_RootStreaks_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootStudy_StagesArgs = {
  distinct_on?: InputMaybe<Array<Study_Stages_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Study_Stages_Order_By>>;
  where?: InputMaybe<Study_Stages_Bool_Exp>;
};

export type Query_RootStudy_Stages_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Study_Stages_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Study_Stages_Order_By>>;
  where?: InputMaybe<Study_Stages_Bool_Exp>;
};

export type Query_RootStudy_Stages_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Query_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Query_RootUsers_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootVerification_CodesArgs = {
  distinct_on?: InputMaybe<Array<Verification_Codes_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Verification_Codes_Order_By>>;
  where?: InputMaybe<Verification_Codes_Bool_Exp>;
};

export type Query_RootVerification_Codes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Verification_Codes_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Verification_Codes_Order_By>>;
  where?: InputMaybe<Verification_Codes_Bool_Exp>;
};

export type Query_RootVerification_Codes_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootVirusArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootVirusesArgs = {
  distinct_on?: InputMaybe<Array<Virus_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Virus_Order_By>>;
  where?: InputMaybe<Virus_Bool_Exp>;
};

export type Query_RootVirusesAggregateArgs = {
  distinct_on?: InputMaybe<Array<Virus_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Virus_Order_By>>;
  where?: InputMaybe<Virus_Bool_Exp>;
};

export type Query_RootVocabulary_CardsArgs = {
  distinct_on?: InputMaybe<Array<Vocabulary_Cards_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Vocabulary_Cards_Order_By>>;
  where?: InputMaybe<Vocabulary_Cards_Bool_Exp>;
};

export type Query_RootVocabulary_Cards_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vocabulary_Cards_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Vocabulary_Cards_Order_By>>;
  where?: InputMaybe<Vocabulary_Cards_Bool_Exp>;
};

export type Query_RootVocabulary_Cards_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootWeekly_StructureArgs = {
  distinct_on?: InputMaybe<Array<Weekly_Structure_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Weekly_Structure_Order_By>>;
  where?: InputMaybe<Weekly_Structure_Bool_Exp>;
};

export type Query_RootWeekly_Structure_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Weekly_Structure_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Weekly_Structure_Order_By>>;
  where?: InputMaybe<Weekly_Structure_Bool_Exp>;
};

export type Query_RootWeekly_Structure_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** columns and relationships of "review_history" */
export type Review_History = {
  __typename?: "review_history";
  card_id?: Maybe<Scalars["uuid"]["output"]>;
  id: Scalars["uuid"]["output"];
  response_time_seconds?: Maybe<Scalars["Int"]["output"]>;
  reviewed_at?: Maybe<Scalars["timestamp"]["output"]>;
  /** An object relationship */
  user?: Maybe<Users>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
  /** An object relationship */
  vocabulary_card?: Maybe<Vocabulary_Cards>;
  was_correct: Scalars["Boolean"]["output"];
};

/** aggregated selection of "review_history" */
export type Review_History_Aggregate = {
  __typename?: "review_history_aggregate";
  aggregate?: Maybe<Review_History_Aggregate_Fields>;
  nodes: Array<Review_History>;
};

export type Review_History_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Review_History_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Review_History_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Review_History_Aggregate_Bool_Exp_Count>;
};

export type Review_History_Aggregate_Bool_Exp_Bool_And = {
  arguments: Review_History_Select_Column_Review_History_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Review_History_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Review_History_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Review_History_Select_Column_Review_History_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Review_History_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Review_History_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Review_History_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Review_History_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "review_history" */
export type Review_History_Aggregate_Fields = {
  __typename?: "review_history_aggregate_fields";
  avg?: Maybe<Review_History_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Review_History_Max_Fields>;
  min?: Maybe<Review_History_Min_Fields>;
  stddev?: Maybe<Review_History_Stddev_Fields>;
  stddev_pop?: Maybe<Review_History_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Review_History_Stddev_Samp_Fields>;
  sum?: Maybe<Review_History_Sum_Fields>;
  var_pop?: Maybe<Review_History_Var_Pop_Fields>;
  var_samp?: Maybe<Review_History_Var_Samp_Fields>;
  variance?: Maybe<Review_History_Variance_Fields>;
};

/** aggregate fields of "review_history" */
export type Review_History_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Review_History_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "review_history" */
export type Review_History_Aggregate_Order_By = {
  avg?: InputMaybe<Review_History_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Review_History_Max_Order_By>;
  min?: InputMaybe<Review_History_Min_Order_By>;
  stddev?: InputMaybe<Review_History_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Review_History_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Review_History_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Review_History_Sum_Order_By>;
  var_pop?: InputMaybe<Review_History_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Review_History_Var_Samp_Order_By>;
  variance?: InputMaybe<Review_History_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "review_history" */
export type Review_History_Arr_Rel_Insert_Input = {
  data: Array<Review_History_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Review_History_On_Conflict>;
};

/** aggregate avg on columns */
export type Review_History_Avg_Fields = {
  __typename?: "review_history_avg_fields";
  response_time_seconds?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "review_history" */
export type Review_History_Avg_Order_By = {
  response_time_seconds?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "review_history". All fields are combined with a logical 'AND'. */
export type Review_History_Bool_Exp = {
  _and?: InputMaybe<Array<Review_History_Bool_Exp>>;
  _not?: InputMaybe<Review_History_Bool_Exp>;
  _or?: InputMaybe<Array<Review_History_Bool_Exp>>;
  card_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  response_time_seconds?: InputMaybe<Int_Comparison_Exp>;
  reviewed_at?: InputMaybe<Timestamp_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
  vocabulary_card?: InputMaybe<Vocabulary_Cards_Bool_Exp>;
  was_correct?: InputMaybe<Boolean_Comparison_Exp>;
};

/** unique or primary key constraints on table "review_history" */
export enum Review_History_Constraint {
  /** unique or primary key constraint on columns "id" */
  ReviewHistoryPkey = "review_history_pkey",
}

/** input type for incrementing numeric columns in table "review_history" */
export type Review_History_Inc_Input = {
  response_time_seconds?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "review_history" */
export type Review_History_Insert_Input = {
  card_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  response_time_seconds?: InputMaybe<Scalars["Int"]["input"]>;
  reviewed_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  vocabulary_card?: InputMaybe<Vocabulary_Cards_Obj_Rel_Insert_Input>;
  was_correct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate max on columns */
export type Review_History_Max_Fields = {
  __typename?: "review_history_max_fields";
  card_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  response_time_seconds?: Maybe<Scalars["Int"]["output"]>;
  reviewed_at?: Maybe<Scalars["timestamp"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "review_history" */
export type Review_History_Max_Order_By = {
  card_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  response_time_seconds?: InputMaybe<Order_By>;
  reviewed_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Review_History_Min_Fields = {
  __typename?: "review_history_min_fields";
  card_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  response_time_seconds?: Maybe<Scalars["Int"]["output"]>;
  reviewed_at?: Maybe<Scalars["timestamp"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "review_history" */
export type Review_History_Min_Order_By = {
  card_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  response_time_seconds?: InputMaybe<Order_By>;
  reviewed_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "review_history" */
export type Review_History_Mutation_Response = {
  __typename?: "review_history_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Review_History>;
};

/** on_conflict condition type for table "review_history" */
export type Review_History_On_Conflict = {
  constraint: Review_History_Constraint;
  update_columns?: Array<Review_History_Update_Column>;
  where?: InputMaybe<Review_History_Bool_Exp>;
};

/** Ordering options when selecting data from "review_history". */
export type Review_History_Order_By = {
  card_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  response_time_seconds?: InputMaybe<Order_By>;
  reviewed_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
  vocabulary_card?: InputMaybe<Vocabulary_Cards_Order_By>;
  was_correct?: InputMaybe<Order_By>;
};

/** primary key columns input for table: review_history */
export type Review_History_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "review_history" */
export enum Review_History_Select_Column {
  /** column name */
  CardId = "card_id",
  /** column name */
  Id = "id",
  /** column name */
  ResponseTimeSeconds = "response_time_seconds",
  /** column name */
  ReviewedAt = "reviewed_at",
  /** column name */
  UserId = "user_id",
  /** column name */
  WasCorrect = "was_correct",
}

/** select "review_history_aggregate_bool_exp_bool_and_arguments_columns" columns of table "review_history" */
export enum Review_History_Select_Column_Review_History_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  WasCorrect = "was_correct",
}

/** select "review_history_aggregate_bool_exp_bool_or_arguments_columns" columns of table "review_history" */
export enum Review_History_Select_Column_Review_History_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  WasCorrect = "was_correct",
}

/** input type for updating data in table "review_history" */
export type Review_History_Set_Input = {
  card_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  response_time_seconds?: InputMaybe<Scalars["Int"]["input"]>;
  reviewed_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  was_correct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate stddev on columns */
export type Review_History_Stddev_Fields = {
  __typename?: "review_history_stddev_fields";
  response_time_seconds?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "review_history" */
export type Review_History_Stddev_Order_By = {
  response_time_seconds?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Review_History_Stddev_Pop_Fields = {
  __typename?: "review_history_stddev_pop_fields";
  response_time_seconds?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "review_history" */
export type Review_History_Stddev_Pop_Order_By = {
  response_time_seconds?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Review_History_Stddev_Samp_Fields = {
  __typename?: "review_history_stddev_samp_fields";
  response_time_seconds?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "review_history" */
export type Review_History_Stddev_Samp_Order_By = {
  response_time_seconds?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "review_history" */
export type Review_History_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Review_History_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Review_History_Stream_Cursor_Value_Input = {
  card_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  response_time_seconds?: InputMaybe<Scalars["Int"]["input"]>;
  reviewed_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  was_correct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate sum on columns */
export type Review_History_Sum_Fields = {
  __typename?: "review_history_sum_fields";
  response_time_seconds?: Maybe<Scalars["Int"]["output"]>;
};

/** order by sum() on columns of table "review_history" */
export type Review_History_Sum_Order_By = {
  response_time_seconds?: InputMaybe<Order_By>;
};

/** update columns of table "review_history" */
export enum Review_History_Update_Column {
  /** column name */
  CardId = "card_id",
  /** column name */
  Id = "id",
  /** column name */
  ResponseTimeSeconds = "response_time_seconds",
  /** column name */
  ReviewedAt = "reviewed_at",
  /** column name */
  UserId = "user_id",
  /** column name */
  WasCorrect = "was_correct",
}

export type Review_History_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Review_History_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Review_History_Set_Input>;
  /** filter the rows which have to be updated */
  where: Review_History_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Review_History_Var_Pop_Fields = {
  __typename?: "review_history_var_pop_fields";
  response_time_seconds?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "review_history" */
export type Review_History_Var_Pop_Order_By = {
  response_time_seconds?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Review_History_Var_Samp_Fields = {
  __typename?: "review_history_var_samp_fields";
  response_time_seconds?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "review_history" */
export type Review_History_Var_Samp_Order_By = {
  response_time_seconds?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Review_History_Variance_Fields = {
  __typename?: "review_history_variance_fields";
  response_time_seconds?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "review_history" */
export type Review_History_Variance_Order_By = {
  response_time_seconds?: InputMaybe<Order_By>;
};

/** columns and relationships of "stage_progress" */
export type Stage_Progress = {
  __typename?: "stage_progress";
  average_accuracy?: Maybe<Scalars["numeric"]["output"]>;
  completed_at?: Maybe<Scalars["date"]["output"]>;
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  errors_pending?: Maybe<Scalars["Int"]["output"]>;
  id: Scalars["uuid"]["output"];
  stage_id?: Maybe<Scalars["uuid"]["output"]>;
  started_at?: Maybe<Scalars["date"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  /** An object relationship */
  study_stage?: Maybe<Study_Stages>;
  tasks_completed?: Maybe<Scalars["Int"]["output"]>;
  tasks_total?: Maybe<Scalars["Int"]["output"]>;
  updated_at?: Maybe<Scalars["timestamp"]["output"]>;
  /** An object relationship */
  user?: Maybe<Users>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
  words_learned?: Maybe<Scalars["Int"]["output"]>;
};

/** aggregated selection of "stage_progress" */
export type Stage_Progress_Aggregate = {
  __typename?: "stage_progress_aggregate";
  aggregate?: Maybe<Stage_Progress_Aggregate_Fields>;
  nodes: Array<Stage_Progress>;
};

export type Stage_Progress_Aggregate_Bool_Exp = {
  count?: InputMaybe<Stage_Progress_Aggregate_Bool_Exp_Count>;
};

export type Stage_Progress_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Stage_Progress_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Stage_Progress_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "stage_progress" */
export type Stage_Progress_Aggregate_Fields = {
  __typename?: "stage_progress_aggregate_fields";
  avg?: Maybe<Stage_Progress_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Stage_Progress_Max_Fields>;
  min?: Maybe<Stage_Progress_Min_Fields>;
  stddev?: Maybe<Stage_Progress_Stddev_Fields>;
  stddev_pop?: Maybe<Stage_Progress_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Stage_Progress_Stddev_Samp_Fields>;
  sum?: Maybe<Stage_Progress_Sum_Fields>;
  var_pop?: Maybe<Stage_Progress_Var_Pop_Fields>;
  var_samp?: Maybe<Stage_Progress_Var_Samp_Fields>;
  variance?: Maybe<Stage_Progress_Variance_Fields>;
};

/** aggregate fields of "stage_progress" */
export type Stage_Progress_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Stage_Progress_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "stage_progress" */
export type Stage_Progress_Aggregate_Order_By = {
  avg?: InputMaybe<Stage_Progress_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Stage_Progress_Max_Order_By>;
  min?: InputMaybe<Stage_Progress_Min_Order_By>;
  stddev?: InputMaybe<Stage_Progress_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Stage_Progress_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Stage_Progress_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Stage_Progress_Sum_Order_By>;
  var_pop?: InputMaybe<Stage_Progress_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Stage_Progress_Var_Samp_Order_By>;
  variance?: InputMaybe<Stage_Progress_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "stage_progress" */
export type Stage_Progress_Arr_Rel_Insert_Input = {
  data: Array<Stage_Progress_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Stage_Progress_On_Conflict>;
};

/** aggregate avg on columns */
export type Stage_Progress_Avg_Fields = {
  __typename?: "stage_progress_avg_fields";
  average_accuracy?: Maybe<Scalars["Float"]["output"]>;
  errors_pending?: Maybe<Scalars["Float"]["output"]>;
  tasks_completed?: Maybe<Scalars["Float"]["output"]>;
  tasks_total?: Maybe<Scalars["Float"]["output"]>;
  words_learned?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "stage_progress" */
export type Stage_Progress_Avg_Order_By = {
  average_accuracy?: InputMaybe<Order_By>;
  errors_pending?: InputMaybe<Order_By>;
  tasks_completed?: InputMaybe<Order_By>;
  tasks_total?: InputMaybe<Order_By>;
  words_learned?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "stage_progress". All fields are combined with a logical 'AND'. */
export type Stage_Progress_Bool_Exp = {
  _and?: InputMaybe<Array<Stage_Progress_Bool_Exp>>;
  _not?: InputMaybe<Stage_Progress_Bool_Exp>;
  _or?: InputMaybe<Array<Stage_Progress_Bool_Exp>>;
  average_accuracy?: InputMaybe<Numeric_Comparison_Exp>;
  completed_at?: InputMaybe<Date_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  errors_pending?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  stage_id?: InputMaybe<Uuid_Comparison_Exp>;
  started_at?: InputMaybe<Date_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  study_stage?: InputMaybe<Study_Stages_Bool_Exp>;
  tasks_completed?: InputMaybe<Int_Comparison_Exp>;
  tasks_total?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
  words_learned?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "stage_progress" */
export enum Stage_Progress_Constraint {
  /** unique or primary key constraint on columns "id" */
  StageProgressPkey = "stage_progress_pkey",
  /** unique or primary key constraint on columns "user_id", "stage_id" */
  StageProgressUserIdStageIdKey = "stage_progress_user_id_stage_id_key",
}

/** input type for incrementing numeric columns in table "stage_progress" */
export type Stage_Progress_Inc_Input = {
  average_accuracy?: InputMaybe<Scalars["numeric"]["input"]>;
  errors_pending?: InputMaybe<Scalars["Int"]["input"]>;
  tasks_completed?: InputMaybe<Scalars["Int"]["input"]>;
  tasks_total?: InputMaybe<Scalars["Int"]["input"]>;
  words_learned?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "stage_progress" */
export type Stage_Progress_Insert_Input = {
  average_accuracy?: InputMaybe<Scalars["numeric"]["input"]>;
  completed_at?: InputMaybe<Scalars["date"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  errors_pending?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  stage_id?: InputMaybe<Scalars["uuid"]["input"]>;
  started_at?: InputMaybe<Scalars["date"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  study_stage?: InputMaybe<Study_Stages_Obj_Rel_Insert_Input>;
  tasks_completed?: InputMaybe<Scalars["Int"]["input"]>;
  tasks_total?: InputMaybe<Scalars["Int"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  words_learned?: InputMaybe<Scalars["Int"]["input"]>;
};

/** aggregate max on columns */
export type Stage_Progress_Max_Fields = {
  __typename?: "stage_progress_max_fields";
  average_accuracy?: Maybe<Scalars["numeric"]["output"]>;
  completed_at?: Maybe<Scalars["date"]["output"]>;
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  errors_pending?: Maybe<Scalars["Int"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  stage_id?: Maybe<Scalars["uuid"]["output"]>;
  started_at?: Maybe<Scalars["date"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  tasks_completed?: Maybe<Scalars["Int"]["output"]>;
  tasks_total?: Maybe<Scalars["Int"]["output"]>;
  updated_at?: Maybe<Scalars["timestamp"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
  words_learned?: Maybe<Scalars["Int"]["output"]>;
};

/** order by max() on columns of table "stage_progress" */
export type Stage_Progress_Max_Order_By = {
  average_accuracy?: InputMaybe<Order_By>;
  completed_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  errors_pending?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  stage_id?: InputMaybe<Order_By>;
  started_at?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  tasks_completed?: InputMaybe<Order_By>;
  tasks_total?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
  words_learned?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Stage_Progress_Min_Fields = {
  __typename?: "stage_progress_min_fields";
  average_accuracy?: Maybe<Scalars["numeric"]["output"]>;
  completed_at?: Maybe<Scalars["date"]["output"]>;
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  errors_pending?: Maybe<Scalars["Int"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  stage_id?: Maybe<Scalars["uuid"]["output"]>;
  started_at?: Maybe<Scalars["date"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  tasks_completed?: Maybe<Scalars["Int"]["output"]>;
  tasks_total?: Maybe<Scalars["Int"]["output"]>;
  updated_at?: Maybe<Scalars["timestamp"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
  words_learned?: Maybe<Scalars["Int"]["output"]>;
};

/** order by min() on columns of table "stage_progress" */
export type Stage_Progress_Min_Order_By = {
  average_accuracy?: InputMaybe<Order_By>;
  completed_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  errors_pending?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  stage_id?: InputMaybe<Order_By>;
  started_at?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  tasks_completed?: InputMaybe<Order_By>;
  tasks_total?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
  words_learned?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "stage_progress" */
export type Stage_Progress_Mutation_Response = {
  __typename?: "stage_progress_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Stage_Progress>;
};

/** on_conflict condition type for table "stage_progress" */
export type Stage_Progress_On_Conflict = {
  constraint: Stage_Progress_Constraint;
  update_columns?: Array<Stage_Progress_Update_Column>;
  where?: InputMaybe<Stage_Progress_Bool_Exp>;
};

/** Ordering options when selecting data from "stage_progress". */
export type Stage_Progress_Order_By = {
  average_accuracy?: InputMaybe<Order_By>;
  completed_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  errors_pending?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  stage_id?: InputMaybe<Order_By>;
  started_at?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  study_stage?: InputMaybe<Study_Stages_Order_By>;
  tasks_completed?: InputMaybe<Order_By>;
  tasks_total?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
  words_learned?: InputMaybe<Order_By>;
};

/** primary key columns input for table: stage_progress */
export type Stage_Progress_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "stage_progress" */
export enum Stage_Progress_Select_Column {
  /** column name */
  AverageAccuracy = "average_accuracy",
  /** column name */
  CompletedAt = "completed_at",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  ErrorsPending = "errors_pending",
  /** column name */
  Id = "id",
  /** column name */
  StageId = "stage_id",
  /** column name */
  StartedAt = "started_at",
  /** column name */
  Status = "status",
  /** column name */
  TasksCompleted = "tasks_completed",
  /** column name */
  TasksTotal = "tasks_total",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
  /** column name */
  WordsLearned = "words_learned",
}

/** input type for updating data in table "stage_progress" */
export type Stage_Progress_Set_Input = {
  average_accuracy?: InputMaybe<Scalars["numeric"]["input"]>;
  completed_at?: InputMaybe<Scalars["date"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  errors_pending?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  stage_id?: InputMaybe<Scalars["uuid"]["input"]>;
  started_at?: InputMaybe<Scalars["date"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  tasks_completed?: InputMaybe<Scalars["Int"]["input"]>;
  tasks_total?: InputMaybe<Scalars["Int"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  words_learned?: InputMaybe<Scalars["Int"]["input"]>;
};

/** aggregate stddev on columns */
export type Stage_Progress_Stddev_Fields = {
  __typename?: "stage_progress_stddev_fields";
  average_accuracy?: Maybe<Scalars["Float"]["output"]>;
  errors_pending?: Maybe<Scalars["Float"]["output"]>;
  tasks_completed?: Maybe<Scalars["Float"]["output"]>;
  tasks_total?: Maybe<Scalars["Float"]["output"]>;
  words_learned?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "stage_progress" */
export type Stage_Progress_Stddev_Order_By = {
  average_accuracy?: InputMaybe<Order_By>;
  errors_pending?: InputMaybe<Order_By>;
  tasks_completed?: InputMaybe<Order_By>;
  tasks_total?: InputMaybe<Order_By>;
  words_learned?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Stage_Progress_Stddev_Pop_Fields = {
  __typename?: "stage_progress_stddev_pop_fields";
  average_accuracy?: Maybe<Scalars["Float"]["output"]>;
  errors_pending?: Maybe<Scalars["Float"]["output"]>;
  tasks_completed?: Maybe<Scalars["Float"]["output"]>;
  tasks_total?: Maybe<Scalars["Float"]["output"]>;
  words_learned?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "stage_progress" */
export type Stage_Progress_Stddev_Pop_Order_By = {
  average_accuracy?: InputMaybe<Order_By>;
  errors_pending?: InputMaybe<Order_By>;
  tasks_completed?: InputMaybe<Order_By>;
  tasks_total?: InputMaybe<Order_By>;
  words_learned?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Stage_Progress_Stddev_Samp_Fields = {
  __typename?: "stage_progress_stddev_samp_fields";
  average_accuracy?: Maybe<Scalars["Float"]["output"]>;
  errors_pending?: Maybe<Scalars["Float"]["output"]>;
  tasks_completed?: Maybe<Scalars["Float"]["output"]>;
  tasks_total?: Maybe<Scalars["Float"]["output"]>;
  words_learned?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "stage_progress" */
export type Stage_Progress_Stddev_Samp_Order_By = {
  average_accuracy?: InputMaybe<Order_By>;
  errors_pending?: InputMaybe<Order_By>;
  tasks_completed?: InputMaybe<Order_By>;
  tasks_total?: InputMaybe<Order_By>;
  words_learned?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "stage_progress" */
export type Stage_Progress_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Stage_Progress_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Stage_Progress_Stream_Cursor_Value_Input = {
  average_accuracy?: InputMaybe<Scalars["numeric"]["input"]>;
  completed_at?: InputMaybe<Scalars["date"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  errors_pending?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  stage_id?: InputMaybe<Scalars["uuid"]["input"]>;
  started_at?: InputMaybe<Scalars["date"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  tasks_completed?: InputMaybe<Scalars["Int"]["input"]>;
  tasks_total?: InputMaybe<Scalars["Int"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  words_learned?: InputMaybe<Scalars["Int"]["input"]>;
};

/** aggregate sum on columns */
export type Stage_Progress_Sum_Fields = {
  __typename?: "stage_progress_sum_fields";
  average_accuracy?: Maybe<Scalars["numeric"]["output"]>;
  errors_pending?: Maybe<Scalars["Int"]["output"]>;
  tasks_completed?: Maybe<Scalars["Int"]["output"]>;
  tasks_total?: Maybe<Scalars["Int"]["output"]>;
  words_learned?: Maybe<Scalars["Int"]["output"]>;
};

/** order by sum() on columns of table "stage_progress" */
export type Stage_Progress_Sum_Order_By = {
  average_accuracy?: InputMaybe<Order_By>;
  errors_pending?: InputMaybe<Order_By>;
  tasks_completed?: InputMaybe<Order_By>;
  tasks_total?: InputMaybe<Order_By>;
  words_learned?: InputMaybe<Order_By>;
};

/** update columns of table "stage_progress" */
export enum Stage_Progress_Update_Column {
  /** column name */
  AverageAccuracy = "average_accuracy",
  /** column name */
  CompletedAt = "completed_at",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  ErrorsPending = "errors_pending",
  /** column name */
  Id = "id",
  /** column name */
  StageId = "stage_id",
  /** column name */
  StartedAt = "started_at",
  /** column name */
  Status = "status",
  /** column name */
  TasksCompleted = "tasks_completed",
  /** column name */
  TasksTotal = "tasks_total",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
  /** column name */
  WordsLearned = "words_learned",
}

export type Stage_Progress_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Stage_Progress_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Stage_Progress_Set_Input>;
  /** filter the rows which have to be updated */
  where: Stage_Progress_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Stage_Progress_Var_Pop_Fields = {
  __typename?: "stage_progress_var_pop_fields";
  average_accuracy?: Maybe<Scalars["Float"]["output"]>;
  errors_pending?: Maybe<Scalars["Float"]["output"]>;
  tasks_completed?: Maybe<Scalars["Float"]["output"]>;
  tasks_total?: Maybe<Scalars["Float"]["output"]>;
  words_learned?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "stage_progress" */
export type Stage_Progress_Var_Pop_Order_By = {
  average_accuracy?: InputMaybe<Order_By>;
  errors_pending?: InputMaybe<Order_By>;
  tasks_completed?: InputMaybe<Order_By>;
  tasks_total?: InputMaybe<Order_By>;
  words_learned?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Stage_Progress_Var_Samp_Fields = {
  __typename?: "stage_progress_var_samp_fields";
  average_accuracy?: Maybe<Scalars["Float"]["output"]>;
  errors_pending?: Maybe<Scalars["Float"]["output"]>;
  tasks_completed?: Maybe<Scalars["Float"]["output"]>;
  tasks_total?: Maybe<Scalars["Float"]["output"]>;
  words_learned?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "stage_progress" */
export type Stage_Progress_Var_Samp_Order_By = {
  average_accuracy?: InputMaybe<Order_By>;
  errors_pending?: InputMaybe<Order_By>;
  tasks_completed?: InputMaybe<Order_By>;
  tasks_total?: InputMaybe<Order_By>;
  words_learned?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Stage_Progress_Variance_Fields = {
  __typename?: "stage_progress_variance_fields";
  average_accuracy?: Maybe<Scalars["Float"]["output"]>;
  errors_pending?: Maybe<Scalars["Float"]["output"]>;
  tasks_completed?: Maybe<Scalars["Float"]["output"]>;
  tasks_total?: Maybe<Scalars["Float"]["output"]>;
  words_learned?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "stage_progress" */
export type Stage_Progress_Variance_Order_By = {
  average_accuracy?: InputMaybe<Order_By>;
  errors_pending?: InputMaybe<Order_By>;
  tasks_completed?: InputMaybe<Order_By>;
  tasks_total?: InputMaybe<Order_By>;
  words_learned?: InputMaybe<Order_By>;
};

/** columns and relationships of "stage_requirements" */
export type Stage_Requirements = {
  __typename?: "stage_requirements";
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["uuid"]["output"];
  order_index: Scalars["Int"]["output"];
  requirement_threshold?: Maybe<Scalars["numeric"]["output"]>;
  requirement_type: Scalars["String"]["output"];
  requirement_value?: Maybe<Scalars["Int"]["output"]>;
  stage_id?: Maybe<Scalars["uuid"]["output"]>;
  /** An object relationship */
  study_stage?: Maybe<Study_Stages>;
};

/** aggregated selection of "stage_requirements" */
export type Stage_Requirements_Aggregate = {
  __typename?: "stage_requirements_aggregate";
  aggregate?: Maybe<Stage_Requirements_Aggregate_Fields>;
  nodes: Array<Stage_Requirements>;
};

export type Stage_Requirements_Aggregate_Bool_Exp = {
  count?: InputMaybe<Stage_Requirements_Aggregate_Bool_Exp_Count>;
};

export type Stage_Requirements_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Stage_Requirements_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Stage_Requirements_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "stage_requirements" */
export type Stage_Requirements_Aggregate_Fields = {
  __typename?: "stage_requirements_aggregate_fields";
  avg?: Maybe<Stage_Requirements_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Stage_Requirements_Max_Fields>;
  min?: Maybe<Stage_Requirements_Min_Fields>;
  stddev?: Maybe<Stage_Requirements_Stddev_Fields>;
  stddev_pop?: Maybe<Stage_Requirements_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Stage_Requirements_Stddev_Samp_Fields>;
  sum?: Maybe<Stage_Requirements_Sum_Fields>;
  var_pop?: Maybe<Stage_Requirements_Var_Pop_Fields>;
  var_samp?: Maybe<Stage_Requirements_Var_Samp_Fields>;
  variance?: Maybe<Stage_Requirements_Variance_Fields>;
};

/** aggregate fields of "stage_requirements" */
export type Stage_Requirements_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Stage_Requirements_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "stage_requirements" */
export type Stage_Requirements_Aggregate_Order_By = {
  avg?: InputMaybe<Stage_Requirements_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Stage_Requirements_Max_Order_By>;
  min?: InputMaybe<Stage_Requirements_Min_Order_By>;
  stddev?: InputMaybe<Stage_Requirements_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Stage_Requirements_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Stage_Requirements_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Stage_Requirements_Sum_Order_By>;
  var_pop?: InputMaybe<Stage_Requirements_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Stage_Requirements_Var_Samp_Order_By>;
  variance?: InputMaybe<Stage_Requirements_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "stage_requirements" */
export type Stage_Requirements_Arr_Rel_Insert_Input = {
  data: Array<Stage_Requirements_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Stage_Requirements_On_Conflict>;
};

/** aggregate avg on columns */
export type Stage_Requirements_Avg_Fields = {
  __typename?: "stage_requirements_avg_fields";
  order_index?: Maybe<Scalars["Float"]["output"]>;
  requirement_threshold?: Maybe<Scalars["Float"]["output"]>;
  requirement_value?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "stage_requirements" */
export type Stage_Requirements_Avg_Order_By = {
  order_index?: InputMaybe<Order_By>;
  requirement_threshold?: InputMaybe<Order_By>;
  requirement_value?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "stage_requirements". All fields are combined with a logical 'AND'. */
export type Stage_Requirements_Bool_Exp = {
  _and?: InputMaybe<Array<Stage_Requirements_Bool_Exp>>;
  _not?: InputMaybe<Stage_Requirements_Bool_Exp>;
  _or?: InputMaybe<Array<Stage_Requirements_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  order_index?: InputMaybe<Int_Comparison_Exp>;
  requirement_threshold?: InputMaybe<Numeric_Comparison_Exp>;
  requirement_type?: InputMaybe<String_Comparison_Exp>;
  requirement_value?: InputMaybe<Int_Comparison_Exp>;
  stage_id?: InputMaybe<Uuid_Comparison_Exp>;
  study_stage?: InputMaybe<Study_Stages_Bool_Exp>;
};

/** unique or primary key constraints on table "stage_requirements" */
export enum Stage_Requirements_Constraint {
  /** unique or primary key constraint on columns "id" */
  StageRequirementsPkey = "stage_requirements_pkey",
}

/** input type for incrementing numeric columns in table "stage_requirements" */
export type Stage_Requirements_Inc_Input = {
  order_index?: InputMaybe<Scalars["Int"]["input"]>;
  requirement_threshold?: InputMaybe<Scalars["numeric"]["input"]>;
  requirement_value?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "stage_requirements" */
export type Stage_Requirements_Insert_Input = {
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  order_index?: InputMaybe<Scalars["Int"]["input"]>;
  requirement_threshold?: InputMaybe<Scalars["numeric"]["input"]>;
  requirement_type?: InputMaybe<Scalars["String"]["input"]>;
  requirement_value?: InputMaybe<Scalars["Int"]["input"]>;
  stage_id?: InputMaybe<Scalars["uuid"]["input"]>;
  study_stage?: InputMaybe<Study_Stages_Obj_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Stage_Requirements_Max_Fields = {
  __typename?: "stage_requirements_max_fields";
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  order_index?: Maybe<Scalars["Int"]["output"]>;
  requirement_threshold?: Maybe<Scalars["numeric"]["output"]>;
  requirement_type?: Maybe<Scalars["String"]["output"]>;
  requirement_value?: Maybe<Scalars["Int"]["output"]>;
  stage_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "stage_requirements" */
export type Stage_Requirements_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_index?: InputMaybe<Order_By>;
  requirement_threshold?: InputMaybe<Order_By>;
  requirement_type?: InputMaybe<Order_By>;
  requirement_value?: InputMaybe<Order_By>;
  stage_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Stage_Requirements_Min_Fields = {
  __typename?: "stage_requirements_min_fields";
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  order_index?: Maybe<Scalars["Int"]["output"]>;
  requirement_threshold?: Maybe<Scalars["numeric"]["output"]>;
  requirement_type?: Maybe<Scalars["String"]["output"]>;
  requirement_value?: Maybe<Scalars["Int"]["output"]>;
  stage_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "stage_requirements" */
export type Stage_Requirements_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_index?: InputMaybe<Order_By>;
  requirement_threshold?: InputMaybe<Order_By>;
  requirement_type?: InputMaybe<Order_By>;
  requirement_value?: InputMaybe<Order_By>;
  stage_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "stage_requirements" */
export type Stage_Requirements_Mutation_Response = {
  __typename?: "stage_requirements_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Stage_Requirements>;
};

/** on_conflict condition type for table "stage_requirements" */
export type Stage_Requirements_On_Conflict = {
  constraint: Stage_Requirements_Constraint;
  update_columns?: Array<Stage_Requirements_Update_Column>;
  where?: InputMaybe<Stage_Requirements_Bool_Exp>;
};

/** Ordering options when selecting data from "stage_requirements". */
export type Stage_Requirements_Order_By = {
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_index?: InputMaybe<Order_By>;
  requirement_threshold?: InputMaybe<Order_By>;
  requirement_type?: InputMaybe<Order_By>;
  requirement_value?: InputMaybe<Order_By>;
  stage_id?: InputMaybe<Order_By>;
  study_stage?: InputMaybe<Study_Stages_Order_By>;
};

/** primary key columns input for table: stage_requirements */
export type Stage_Requirements_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "stage_requirements" */
export enum Stage_Requirements_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Description = "description",
  /** column name */
  Id = "id",
  /** column name */
  OrderIndex = "order_index",
  /** column name */
  RequirementThreshold = "requirement_threshold",
  /** column name */
  RequirementType = "requirement_type",
  /** column name */
  RequirementValue = "requirement_value",
  /** column name */
  StageId = "stage_id",
}

/** input type for updating data in table "stage_requirements" */
export type Stage_Requirements_Set_Input = {
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  order_index?: InputMaybe<Scalars["Int"]["input"]>;
  requirement_threshold?: InputMaybe<Scalars["numeric"]["input"]>;
  requirement_type?: InputMaybe<Scalars["String"]["input"]>;
  requirement_value?: InputMaybe<Scalars["Int"]["input"]>;
  stage_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Stage_Requirements_Stddev_Fields = {
  __typename?: "stage_requirements_stddev_fields";
  order_index?: Maybe<Scalars["Float"]["output"]>;
  requirement_threshold?: Maybe<Scalars["Float"]["output"]>;
  requirement_value?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "stage_requirements" */
export type Stage_Requirements_Stddev_Order_By = {
  order_index?: InputMaybe<Order_By>;
  requirement_threshold?: InputMaybe<Order_By>;
  requirement_value?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Stage_Requirements_Stddev_Pop_Fields = {
  __typename?: "stage_requirements_stddev_pop_fields";
  order_index?: Maybe<Scalars["Float"]["output"]>;
  requirement_threshold?: Maybe<Scalars["Float"]["output"]>;
  requirement_value?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "stage_requirements" */
export type Stage_Requirements_Stddev_Pop_Order_By = {
  order_index?: InputMaybe<Order_By>;
  requirement_threshold?: InputMaybe<Order_By>;
  requirement_value?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Stage_Requirements_Stddev_Samp_Fields = {
  __typename?: "stage_requirements_stddev_samp_fields";
  order_index?: Maybe<Scalars["Float"]["output"]>;
  requirement_threshold?: Maybe<Scalars["Float"]["output"]>;
  requirement_value?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "stage_requirements" */
export type Stage_Requirements_Stddev_Samp_Order_By = {
  order_index?: InputMaybe<Order_By>;
  requirement_threshold?: InputMaybe<Order_By>;
  requirement_value?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "stage_requirements" */
export type Stage_Requirements_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Stage_Requirements_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Stage_Requirements_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  order_index?: InputMaybe<Scalars["Int"]["input"]>;
  requirement_threshold?: InputMaybe<Scalars["numeric"]["input"]>;
  requirement_type?: InputMaybe<Scalars["String"]["input"]>;
  requirement_value?: InputMaybe<Scalars["Int"]["input"]>;
  stage_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Stage_Requirements_Sum_Fields = {
  __typename?: "stage_requirements_sum_fields";
  order_index?: Maybe<Scalars["Int"]["output"]>;
  requirement_threshold?: Maybe<Scalars["numeric"]["output"]>;
  requirement_value?: Maybe<Scalars["Int"]["output"]>;
};

/** order by sum() on columns of table "stage_requirements" */
export type Stage_Requirements_Sum_Order_By = {
  order_index?: InputMaybe<Order_By>;
  requirement_threshold?: InputMaybe<Order_By>;
  requirement_value?: InputMaybe<Order_By>;
};

/** update columns of table "stage_requirements" */
export enum Stage_Requirements_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Description = "description",
  /** column name */
  Id = "id",
  /** column name */
  OrderIndex = "order_index",
  /** column name */
  RequirementThreshold = "requirement_threshold",
  /** column name */
  RequirementType = "requirement_type",
  /** column name */
  RequirementValue = "requirement_value",
  /** column name */
  StageId = "stage_id",
}

export type Stage_Requirements_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Stage_Requirements_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Stage_Requirements_Set_Input>;
  /** filter the rows which have to be updated */
  where: Stage_Requirements_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Stage_Requirements_Var_Pop_Fields = {
  __typename?: "stage_requirements_var_pop_fields";
  order_index?: Maybe<Scalars["Float"]["output"]>;
  requirement_threshold?: Maybe<Scalars["Float"]["output"]>;
  requirement_value?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "stage_requirements" */
export type Stage_Requirements_Var_Pop_Order_By = {
  order_index?: InputMaybe<Order_By>;
  requirement_threshold?: InputMaybe<Order_By>;
  requirement_value?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Stage_Requirements_Var_Samp_Fields = {
  __typename?: "stage_requirements_var_samp_fields";
  order_index?: Maybe<Scalars["Float"]["output"]>;
  requirement_threshold?: Maybe<Scalars["Float"]["output"]>;
  requirement_value?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "stage_requirements" */
export type Stage_Requirements_Var_Samp_Order_By = {
  order_index?: InputMaybe<Order_By>;
  requirement_threshold?: InputMaybe<Order_By>;
  requirement_value?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Stage_Requirements_Variance_Fields = {
  __typename?: "stage_requirements_variance_fields";
  order_index?: Maybe<Scalars["Float"]["output"]>;
  requirement_threshold?: Maybe<Scalars["Float"]["output"]>;
  requirement_value?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "stage_requirements" */
export type Stage_Requirements_Variance_Order_By = {
  order_index?: InputMaybe<Order_By>;
  requirement_threshold?: InputMaybe<Order_By>;
  requirement_value?: InputMaybe<Order_By>;
};

/** columns and relationships of "stage_tests" */
export type Stage_Tests = {
  __typename?: "stage_tests";
  completed_at?: Maybe<Scalars["timestamp"]["output"]>;
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  feedback?: Maybe<Scalars["jsonb"]["output"]>;
  id: Scalars["uuid"]["output"];
  passed?: Maybe<Scalars["Boolean"]["output"]>;
  questions?: Maybe<Scalars["jsonb"]["output"]>;
  score?: Maybe<Scalars["numeric"]["output"]>;
  stage_id?: Maybe<Scalars["uuid"]["output"]>;
  started_at?: Maybe<Scalars["timestamp"]["output"]>;
  /** An object relationship */
  study_stage?: Maybe<Study_Stages>;
  test_type: Scalars["String"]["output"];
  /** An object relationship */
  user?: Maybe<Users>;
  user_answers?: Maybe<Scalars["jsonb"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** columns and relationships of "stage_tests" */
export type Stage_TestsFeedbackArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "stage_tests" */
export type Stage_TestsQuestionsArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "stage_tests" */
export type Stage_TestsUser_AnswersArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "stage_tests" */
export type Stage_Tests_Aggregate = {
  __typename?: "stage_tests_aggregate";
  aggregate?: Maybe<Stage_Tests_Aggregate_Fields>;
  nodes: Array<Stage_Tests>;
};

export type Stage_Tests_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Stage_Tests_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Stage_Tests_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Stage_Tests_Aggregate_Bool_Exp_Count>;
};

export type Stage_Tests_Aggregate_Bool_Exp_Bool_And = {
  arguments: Stage_Tests_Select_Column_Stage_Tests_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Stage_Tests_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Stage_Tests_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Stage_Tests_Select_Column_Stage_Tests_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Stage_Tests_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Stage_Tests_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Stage_Tests_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Stage_Tests_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "stage_tests" */
export type Stage_Tests_Aggregate_Fields = {
  __typename?: "stage_tests_aggregate_fields";
  avg?: Maybe<Stage_Tests_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Stage_Tests_Max_Fields>;
  min?: Maybe<Stage_Tests_Min_Fields>;
  stddev?: Maybe<Stage_Tests_Stddev_Fields>;
  stddev_pop?: Maybe<Stage_Tests_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Stage_Tests_Stddev_Samp_Fields>;
  sum?: Maybe<Stage_Tests_Sum_Fields>;
  var_pop?: Maybe<Stage_Tests_Var_Pop_Fields>;
  var_samp?: Maybe<Stage_Tests_Var_Samp_Fields>;
  variance?: Maybe<Stage_Tests_Variance_Fields>;
};

/** aggregate fields of "stage_tests" */
export type Stage_Tests_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Stage_Tests_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "stage_tests" */
export type Stage_Tests_Aggregate_Order_By = {
  avg?: InputMaybe<Stage_Tests_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Stage_Tests_Max_Order_By>;
  min?: InputMaybe<Stage_Tests_Min_Order_By>;
  stddev?: InputMaybe<Stage_Tests_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Stage_Tests_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Stage_Tests_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Stage_Tests_Sum_Order_By>;
  var_pop?: InputMaybe<Stage_Tests_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Stage_Tests_Var_Samp_Order_By>;
  variance?: InputMaybe<Stage_Tests_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Stage_Tests_Append_Input = {
  feedback?: InputMaybe<Scalars["jsonb"]["input"]>;
  questions?: InputMaybe<Scalars["jsonb"]["input"]>;
  user_answers?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "stage_tests" */
export type Stage_Tests_Arr_Rel_Insert_Input = {
  data: Array<Stage_Tests_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Stage_Tests_On_Conflict>;
};

/** aggregate avg on columns */
export type Stage_Tests_Avg_Fields = {
  __typename?: "stage_tests_avg_fields";
  score?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "stage_tests" */
export type Stage_Tests_Avg_Order_By = {
  score?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "stage_tests". All fields are combined with a logical 'AND'. */
export type Stage_Tests_Bool_Exp = {
  _and?: InputMaybe<Array<Stage_Tests_Bool_Exp>>;
  _not?: InputMaybe<Stage_Tests_Bool_Exp>;
  _or?: InputMaybe<Array<Stage_Tests_Bool_Exp>>;
  completed_at?: InputMaybe<Timestamp_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  feedback?: InputMaybe<Jsonb_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  passed?: InputMaybe<Boolean_Comparison_Exp>;
  questions?: InputMaybe<Jsonb_Comparison_Exp>;
  score?: InputMaybe<Numeric_Comparison_Exp>;
  stage_id?: InputMaybe<Uuid_Comparison_Exp>;
  started_at?: InputMaybe<Timestamp_Comparison_Exp>;
  study_stage?: InputMaybe<Study_Stages_Bool_Exp>;
  test_type?: InputMaybe<String_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_answers?: InputMaybe<Jsonb_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "stage_tests" */
export enum Stage_Tests_Constraint {
  /** unique or primary key constraint on columns "id" */
  StageTestsPkey = "stage_tests_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Stage_Tests_Delete_At_Path_Input = {
  feedback?: InputMaybe<Array<Scalars["String"]["input"]>>;
  questions?: InputMaybe<Array<Scalars["String"]["input"]>>;
  user_answers?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Stage_Tests_Delete_Elem_Input = {
  feedback?: InputMaybe<Scalars["Int"]["input"]>;
  questions?: InputMaybe<Scalars["Int"]["input"]>;
  user_answers?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Stage_Tests_Delete_Key_Input = {
  feedback?: InputMaybe<Scalars["String"]["input"]>;
  questions?: InputMaybe<Scalars["String"]["input"]>;
  user_answers?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "stage_tests" */
export type Stage_Tests_Inc_Input = {
  score?: InputMaybe<Scalars["numeric"]["input"]>;
};

/** input type for inserting data into table "stage_tests" */
export type Stage_Tests_Insert_Input = {
  completed_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  feedback?: InputMaybe<Scalars["jsonb"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  passed?: InputMaybe<Scalars["Boolean"]["input"]>;
  questions?: InputMaybe<Scalars["jsonb"]["input"]>;
  score?: InputMaybe<Scalars["numeric"]["input"]>;
  stage_id?: InputMaybe<Scalars["uuid"]["input"]>;
  started_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  study_stage?: InputMaybe<Study_Stages_Obj_Rel_Insert_Input>;
  test_type?: InputMaybe<Scalars["String"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_answers?: InputMaybe<Scalars["jsonb"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Stage_Tests_Max_Fields = {
  __typename?: "stage_tests_max_fields";
  completed_at?: Maybe<Scalars["timestamp"]["output"]>;
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  score?: Maybe<Scalars["numeric"]["output"]>;
  stage_id?: Maybe<Scalars["uuid"]["output"]>;
  started_at?: Maybe<Scalars["timestamp"]["output"]>;
  test_type?: Maybe<Scalars["String"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "stage_tests" */
export type Stage_Tests_Max_Order_By = {
  completed_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  score?: InputMaybe<Order_By>;
  stage_id?: InputMaybe<Order_By>;
  started_at?: InputMaybe<Order_By>;
  test_type?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Stage_Tests_Min_Fields = {
  __typename?: "stage_tests_min_fields";
  completed_at?: Maybe<Scalars["timestamp"]["output"]>;
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  score?: Maybe<Scalars["numeric"]["output"]>;
  stage_id?: Maybe<Scalars["uuid"]["output"]>;
  started_at?: Maybe<Scalars["timestamp"]["output"]>;
  test_type?: Maybe<Scalars["String"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "stage_tests" */
export type Stage_Tests_Min_Order_By = {
  completed_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  score?: InputMaybe<Order_By>;
  stage_id?: InputMaybe<Order_By>;
  started_at?: InputMaybe<Order_By>;
  test_type?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "stage_tests" */
export type Stage_Tests_Mutation_Response = {
  __typename?: "stage_tests_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Stage_Tests>;
};

/** on_conflict condition type for table "stage_tests" */
export type Stage_Tests_On_Conflict = {
  constraint: Stage_Tests_Constraint;
  update_columns?: Array<Stage_Tests_Update_Column>;
  where?: InputMaybe<Stage_Tests_Bool_Exp>;
};

/** Ordering options when selecting data from "stage_tests". */
export type Stage_Tests_Order_By = {
  completed_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  feedback?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  passed?: InputMaybe<Order_By>;
  questions?: InputMaybe<Order_By>;
  score?: InputMaybe<Order_By>;
  stage_id?: InputMaybe<Order_By>;
  started_at?: InputMaybe<Order_By>;
  study_stage?: InputMaybe<Study_Stages_Order_By>;
  test_type?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_answers?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: stage_tests */
export type Stage_Tests_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Stage_Tests_Prepend_Input = {
  feedback?: InputMaybe<Scalars["jsonb"]["input"]>;
  questions?: InputMaybe<Scalars["jsonb"]["input"]>;
  user_answers?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "stage_tests" */
export enum Stage_Tests_Select_Column {
  /** column name */
  CompletedAt = "completed_at",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Feedback = "feedback",
  /** column name */
  Id = "id",
  /** column name */
  Passed = "passed",
  /** column name */
  Questions = "questions",
  /** column name */
  Score = "score",
  /** column name */
  StageId = "stage_id",
  /** column name */
  StartedAt = "started_at",
  /** column name */
  TestType = "test_type",
  /** column name */
  UserAnswers = "user_answers",
  /** column name */
  UserId = "user_id",
}

/** select "stage_tests_aggregate_bool_exp_bool_and_arguments_columns" columns of table "stage_tests" */
export enum Stage_Tests_Select_Column_Stage_Tests_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Passed = "passed",
}

/** select "stage_tests_aggregate_bool_exp_bool_or_arguments_columns" columns of table "stage_tests" */
export enum Stage_Tests_Select_Column_Stage_Tests_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Passed = "passed",
}

/** input type for updating data in table "stage_tests" */
export type Stage_Tests_Set_Input = {
  completed_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  feedback?: InputMaybe<Scalars["jsonb"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  passed?: InputMaybe<Scalars["Boolean"]["input"]>;
  questions?: InputMaybe<Scalars["jsonb"]["input"]>;
  score?: InputMaybe<Scalars["numeric"]["input"]>;
  stage_id?: InputMaybe<Scalars["uuid"]["input"]>;
  started_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  test_type?: InputMaybe<Scalars["String"]["input"]>;
  user_answers?: InputMaybe<Scalars["jsonb"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Stage_Tests_Stddev_Fields = {
  __typename?: "stage_tests_stddev_fields";
  score?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "stage_tests" */
export type Stage_Tests_Stddev_Order_By = {
  score?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Stage_Tests_Stddev_Pop_Fields = {
  __typename?: "stage_tests_stddev_pop_fields";
  score?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "stage_tests" */
export type Stage_Tests_Stddev_Pop_Order_By = {
  score?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Stage_Tests_Stddev_Samp_Fields = {
  __typename?: "stage_tests_stddev_samp_fields";
  score?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "stage_tests" */
export type Stage_Tests_Stddev_Samp_Order_By = {
  score?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "stage_tests" */
export type Stage_Tests_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Stage_Tests_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Stage_Tests_Stream_Cursor_Value_Input = {
  completed_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  feedback?: InputMaybe<Scalars["jsonb"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  passed?: InputMaybe<Scalars["Boolean"]["input"]>;
  questions?: InputMaybe<Scalars["jsonb"]["input"]>;
  score?: InputMaybe<Scalars["numeric"]["input"]>;
  stage_id?: InputMaybe<Scalars["uuid"]["input"]>;
  started_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  test_type?: InputMaybe<Scalars["String"]["input"]>;
  user_answers?: InputMaybe<Scalars["jsonb"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Stage_Tests_Sum_Fields = {
  __typename?: "stage_tests_sum_fields";
  score?: Maybe<Scalars["numeric"]["output"]>;
};

/** order by sum() on columns of table "stage_tests" */
export type Stage_Tests_Sum_Order_By = {
  score?: InputMaybe<Order_By>;
};

/** update columns of table "stage_tests" */
export enum Stage_Tests_Update_Column {
  /** column name */
  CompletedAt = "completed_at",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Feedback = "feedback",
  /** column name */
  Id = "id",
  /** column name */
  Passed = "passed",
  /** column name */
  Questions = "questions",
  /** column name */
  Score = "score",
  /** column name */
  StageId = "stage_id",
  /** column name */
  StartedAt = "started_at",
  /** column name */
  TestType = "test_type",
  /** column name */
  UserAnswers = "user_answers",
  /** column name */
  UserId = "user_id",
}

export type Stage_Tests_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Stage_Tests_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Stage_Tests_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Stage_Tests_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Stage_Tests_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Stage_Tests_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Stage_Tests_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Stage_Tests_Set_Input>;
  /** filter the rows which have to be updated */
  where: Stage_Tests_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Stage_Tests_Var_Pop_Fields = {
  __typename?: "stage_tests_var_pop_fields";
  score?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "stage_tests" */
export type Stage_Tests_Var_Pop_Order_By = {
  score?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Stage_Tests_Var_Samp_Fields = {
  __typename?: "stage_tests_var_samp_fields";
  score?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "stage_tests" */
export type Stage_Tests_Var_Samp_Order_By = {
  score?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Stage_Tests_Variance_Fields = {
  __typename?: "stage_tests_variance_fields";
  score?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "stage_tests" */
export type Stage_Tests_Variance_Order_By = {
  score?: InputMaybe<Order_By>;
};

/** columns and relationships of "streaks" */
export type Streaks = {
  __typename?: "streaks";
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  current_streak?: Maybe<Scalars["Int"]["output"]>;
  id: Scalars["uuid"]["output"];
  last_activity_date?: Maybe<Scalars["date"]["output"]>;
  longest_streak?: Maybe<Scalars["Int"]["output"]>;
  updated_at?: Maybe<Scalars["timestamp"]["output"]>;
  /** An object relationship */
  user?: Maybe<Users>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregated selection of "streaks" */
export type Streaks_Aggregate = {
  __typename?: "streaks_aggregate";
  aggregate?: Maybe<Streaks_Aggregate_Fields>;
  nodes: Array<Streaks>;
};

/** aggregate fields of "streaks" */
export type Streaks_Aggregate_Fields = {
  __typename?: "streaks_aggregate_fields";
  avg?: Maybe<Streaks_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Streaks_Max_Fields>;
  min?: Maybe<Streaks_Min_Fields>;
  stddev?: Maybe<Streaks_Stddev_Fields>;
  stddev_pop?: Maybe<Streaks_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Streaks_Stddev_Samp_Fields>;
  sum?: Maybe<Streaks_Sum_Fields>;
  var_pop?: Maybe<Streaks_Var_Pop_Fields>;
  var_samp?: Maybe<Streaks_Var_Samp_Fields>;
  variance?: Maybe<Streaks_Variance_Fields>;
};

/** aggregate fields of "streaks" */
export type Streaks_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Streaks_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Streaks_Avg_Fields = {
  __typename?: "streaks_avg_fields";
  current_streak?: Maybe<Scalars["Float"]["output"]>;
  longest_streak?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "streaks". All fields are combined with a logical 'AND'. */
export type Streaks_Bool_Exp = {
  _and?: InputMaybe<Array<Streaks_Bool_Exp>>;
  _not?: InputMaybe<Streaks_Bool_Exp>;
  _or?: InputMaybe<Array<Streaks_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  current_streak?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  last_activity_date?: InputMaybe<Date_Comparison_Exp>;
  longest_streak?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "streaks" */
export enum Streaks_Constraint {
  /** unique or primary key constraint on columns "id" */
  StreaksPkey = "streaks_pkey",
  /** unique or primary key constraint on columns "user_id" */
  StreaksUserIdKey = "streaks_user_id_key",
}

/** input type for incrementing numeric columns in table "streaks" */
export type Streaks_Inc_Input = {
  current_streak?: InputMaybe<Scalars["Int"]["input"]>;
  longest_streak?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "streaks" */
export type Streaks_Insert_Input = {
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  current_streak?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  last_activity_date?: InputMaybe<Scalars["date"]["input"]>;
  longest_streak?: InputMaybe<Scalars["Int"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Streaks_Max_Fields = {
  __typename?: "streaks_max_fields";
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  current_streak?: Maybe<Scalars["Int"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  last_activity_date?: Maybe<Scalars["date"]["output"]>;
  longest_streak?: Maybe<Scalars["Int"]["output"]>;
  updated_at?: Maybe<Scalars["timestamp"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregate min on columns */
export type Streaks_Min_Fields = {
  __typename?: "streaks_min_fields";
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  current_streak?: Maybe<Scalars["Int"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  last_activity_date?: Maybe<Scalars["date"]["output"]>;
  longest_streak?: Maybe<Scalars["Int"]["output"]>;
  updated_at?: Maybe<Scalars["timestamp"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** response of any mutation on the table "streaks" */
export type Streaks_Mutation_Response = {
  __typename?: "streaks_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Streaks>;
};

/** input type for inserting object relation for remote table "streaks" */
export type Streaks_Obj_Rel_Insert_Input = {
  data: Streaks_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Streaks_On_Conflict>;
};

/** on_conflict condition type for table "streaks" */
export type Streaks_On_Conflict = {
  constraint: Streaks_Constraint;
  update_columns?: Array<Streaks_Update_Column>;
  where?: InputMaybe<Streaks_Bool_Exp>;
};

/** Ordering options when selecting data from "streaks". */
export type Streaks_Order_By = {
  created_at?: InputMaybe<Order_By>;
  current_streak?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  last_activity_date?: InputMaybe<Order_By>;
  longest_streak?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: streaks */
export type Streaks_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "streaks" */
export enum Streaks_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  CurrentStreak = "current_streak",
  /** column name */
  Id = "id",
  /** column name */
  LastActivityDate = "last_activity_date",
  /** column name */
  LongestStreak = "longest_streak",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "streaks" */
export type Streaks_Set_Input = {
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  current_streak?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  last_activity_date?: InputMaybe<Scalars["date"]["input"]>;
  longest_streak?: InputMaybe<Scalars["Int"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Streaks_Stddev_Fields = {
  __typename?: "streaks_stddev_fields";
  current_streak?: Maybe<Scalars["Float"]["output"]>;
  longest_streak?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Streaks_Stddev_Pop_Fields = {
  __typename?: "streaks_stddev_pop_fields";
  current_streak?: Maybe<Scalars["Float"]["output"]>;
  longest_streak?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Streaks_Stddev_Samp_Fields = {
  __typename?: "streaks_stddev_samp_fields";
  current_streak?: Maybe<Scalars["Float"]["output"]>;
  longest_streak?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "streaks" */
export type Streaks_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Streaks_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Streaks_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  current_streak?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  last_activity_date?: InputMaybe<Scalars["date"]["input"]>;
  longest_streak?: InputMaybe<Scalars["Int"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Streaks_Sum_Fields = {
  __typename?: "streaks_sum_fields";
  current_streak?: Maybe<Scalars["Int"]["output"]>;
  longest_streak?: Maybe<Scalars["Int"]["output"]>;
};

/** update columns of table "streaks" */
export enum Streaks_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  CurrentStreak = "current_streak",
  /** column name */
  Id = "id",
  /** column name */
  LastActivityDate = "last_activity_date",
  /** column name */
  LongestStreak = "longest_streak",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Streaks_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Streaks_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Streaks_Set_Input>;
  /** filter the rows which have to be updated */
  where: Streaks_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Streaks_Var_Pop_Fields = {
  __typename?: "streaks_var_pop_fields";
  current_streak?: Maybe<Scalars["Float"]["output"]>;
  longest_streak?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Streaks_Var_Samp_Fields = {
  __typename?: "streaks_var_samp_fields";
  current_streak?: Maybe<Scalars["Float"]["output"]>;
  longest_streak?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Streaks_Variance_Fields = {
  __typename?: "streaks_variance_fields";
  current_streak?: Maybe<Scalars["Float"]["output"]>;
  longest_streak?: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "study_stages" */
export type Study_Stages = {
  __typename?: "study_stages";
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  /** An array relationship */
  daily_tasks: Array<Daily_Tasks>;
  /** An aggregate relationship */
  daily_tasks_aggregate: Daily_Tasks_Aggregate;
  description?: Maybe<Scalars["String"]["output"]>;
  end_month: Scalars["Int"]["output"];
  focus?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["uuid"]["output"];
  level_from: Scalars["String"]["output"];
  level_to: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  order_index: Scalars["Int"]["output"];
  /** An array relationship */
  stage_progresses: Array<Stage_Progress>;
  /** An aggregate relationship */
  stage_progresses_aggregate: Stage_Progress_Aggregate;
  /** An array relationship */
  stage_requirements: Array<Stage_Requirements>;
  /** An aggregate relationship */
  stage_requirements_aggregate: Stage_Requirements_Aggregate;
  /** An array relationship */
  stage_tests: Array<Stage_Tests>;
  /** An aggregate relationship */
  stage_tests_aggregate: Stage_Tests_Aggregate;
  start_month: Scalars["Int"]["output"];
  /** An array relationship */
  weekly_structures: Array<Weekly_Structure>;
  /** An aggregate relationship */
  weekly_structures_aggregate: Weekly_Structure_Aggregate;
};

/** columns and relationships of "study_stages" */
export type Study_StagesDaily_TasksArgs = {
  distinct_on?: InputMaybe<Array<Daily_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Daily_Tasks_Order_By>>;
  where?: InputMaybe<Daily_Tasks_Bool_Exp>;
};

/** columns and relationships of "study_stages" */
export type Study_StagesDaily_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Daily_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Daily_Tasks_Order_By>>;
  where?: InputMaybe<Daily_Tasks_Bool_Exp>;
};

/** columns and relationships of "study_stages" */
export type Study_StagesStage_ProgressesArgs = {
  distinct_on?: InputMaybe<Array<Stage_Progress_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Stage_Progress_Order_By>>;
  where?: InputMaybe<Stage_Progress_Bool_Exp>;
};

/** columns and relationships of "study_stages" */
export type Study_StagesStage_Progresses_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Stage_Progress_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Stage_Progress_Order_By>>;
  where?: InputMaybe<Stage_Progress_Bool_Exp>;
};

/** columns and relationships of "study_stages" */
export type Study_StagesStage_RequirementsArgs = {
  distinct_on?: InputMaybe<Array<Stage_Requirements_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Stage_Requirements_Order_By>>;
  where?: InputMaybe<Stage_Requirements_Bool_Exp>;
};

/** columns and relationships of "study_stages" */
export type Study_StagesStage_Requirements_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Stage_Requirements_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Stage_Requirements_Order_By>>;
  where?: InputMaybe<Stage_Requirements_Bool_Exp>;
};

/** columns and relationships of "study_stages" */
export type Study_StagesStage_TestsArgs = {
  distinct_on?: InputMaybe<Array<Stage_Tests_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Stage_Tests_Order_By>>;
  where?: InputMaybe<Stage_Tests_Bool_Exp>;
};

/** columns and relationships of "study_stages" */
export type Study_StagesStage_Tests_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Stage_Tests_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Stage_Tests_Order_By>>;
  where?: InputMaybe<Stage_Tests_Bool_Exp>;
};

/** columns and relationships of "study_stages" */
export type Study_StagesWeekly_StructuresArgs = {
  distinct_on?: InputMaybe<Array<Weekly_Structure_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Weekly_Structure_Order_By>>;
  where?: InputMaybe<Weekly_Structure_Bool_Exp>;
};

/** columns and relationships of "study_stages" */
export type Study_StagesWeekly_Structures_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Weekly_Structure_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Weekly_Structure_Order_By>>;
  where?: InputMaybe<Weekly_Structure_Bool_Exp>;
};

/** aggregated selection of "study_stages" */
export type Study_Stages_Aggregate = {
  __typename?: "study_stages_aggregate";
  aggregate?: Maybe<Study_Stages_Aggregate_Fields>;
  nodes: Array<Study_Stages>;
};

/** aggregate fields of "study_stages" */
export type Study_Stages_Aggregate_Fields = {
  __typename?: "study_stages_aggregate_fields";
  avg?: Maybe<Study_Stages_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Study_Stages_Max_Fields>;
  min?: Maybe<Study_Stages_Min_Fields>;
  stddev?: Maybe<Study_Stages_Stddev_Fields>;
  stddev_pop?: Maybe<Study_Stages_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Study_Stages_Stddev_Samp_Fields>;
  sum?: Maybe<Study_Stages_Sum_Fields>;
  var_pop?: Maybe<Study_Stages_Var_Pop_Fields>;
  var_samp?: Maybe<Study_Stages_Var_Samp_Fields>;
  variance?: Maybe<Study_Stages_Variance_Fields>;
};

/** aggregate fields of "study_stages" */
export type Study_Stages_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Study_Stages_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Study_Stages_Avg_Fields = {
  __typename?: "study_stages_avg_fields";
  end_month?: Maybe<Scalars["Float"]["output"]>;
  order_index?: Maybe<Scalars["Float"]["output"]>;
  start_month?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "study_stages". All fields are combined with a logical 'AND'. */
export type Study_Stages_Bool_Exp = {
  _and?: InputMaybe<Array<Study_Stages_Bool_Exp>>;
  _not?: InputMaybe<Study_Stages_Bool_Exp>;
  _or?: InputMaybe<Array<Study_Stages_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  daily_tasks?: InputMaybe<Daily_Tasks_Bool_Exp>;
  daily_tasks_aggregate?: InputMaybe<Daily_Tasks_Aggregate_Bool_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  end_month?: InputMaybe<Int_Comparison_Exp>;
  focus?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  level_from?: InputMaybe<String_Comparison_Exp>;
  level_to?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  order_index?: InputMaybe<Int_Comparison_Exp>;
  stage_progresses?: InputMaybe<Stage_Progress_Bool_Exp>;
  stage_progresses_aggregate?: InputMaybe<Stage_Progress_Aggregate_Bool_Exp>;
  stage_requirements?: InputMaybe<Stage_Requirements_Bool_Exp>;
  stage_requirements_aggregate?: InputMaybe<Stage_Requirements_Aggregate_Bool_Exp>;
  stage_tests?: InputMaybe<Stage_Tests_Bool_Exp>;
  stage_tests_aggregate?: InputMaybe<Stage_Tests_Aggregate_Bool_Exp>;
  start_month?: InputMaybe<Int_Comparison_Exp>;
  weekly_structures?: InputMaybe<Weekly_Structure_Bool_Exp>;
  weekly_structures_aggregate?: InputMaybe<Weekly_Structure_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "study_stages" */
export enum Study_Stages_Constraint {
  /** unique or primary key constraint on columns "id" */
  StudyStagesPkey = "study_stages_pkey",
}

/** input type for incrementing numeric columns in table "study_stages" */
export type Study_Stages_Inc_Input = {
  end_month?: InputMaybe<Scalars["Int"]["input"]>;
  order_index?: InputMaybe<Scalars["Int"]["input"]>;
  start_month?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "study_stages" */
export type Study_Stages_Insert_Input = {
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  daily_tasks?: InputMaybe<Daily_Tasks_Arr_Rel_Insert_Input>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  end_month?: InputMaybe<Scalars["Int"]["input"]>;
  focus?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  level_from?: InputMaybe<Scalars["String"]["input"]>;
  level_to?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  order_index?: InputMaybe<Scalars["Int"]["input"]>;
  stage_progresses?: InputMaybe<Stage_Progress_Arr_Rel_Insert_Input>;
  stage_requirements?: InputMaybe<Stage_Requirements_Arr_Rel_Insert_Input>;
  stage_tests?: InputMaybe<Stage_Tests_Arr_Rel_Insert_Input>;
  start_month?: InputMaybe<Scalars["Int"]["input"]>;
  weekly_structures?: InputMaybe<Weekly_Structure_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Study_Stages_Max_Fields = {
  __typename?: "study_stages_max_fields";
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  end_month?: Maybe<Scalars["Int"]["output"]>;
  focus?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  level_from?: Maybe<Scalars["String"]["output"]>;
  level_to?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  order_index?: Maybe<Scalars["Int"]["output"]>;
  start_month?: Maybe<Scalars["Int"]["output"]>;
};

/** aggregate min on columns */
export type Study_Stages_Min_Fields = {
  __typename?: "study_stages_min_fields";
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  end_month?: Maybe<Scalars["Int"]["output"]>;
  focus?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  level_from?: Maybe<Scalars["String"]["output"]>;
  level_to?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  order_index?: Maybe<Scalars["Int"]["output"]>;
  start_month?: Maybe<Scalars["Int"]["output"]>;
};

/** response of any mutation on the table "study_stages" */
export type Study_Stages_Mutation_Response = {
  __typename?: "study_stages_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Study_Stages>;
};

/** input type for inserting object relation for remote table "study_stages" */
export type Study_Stages_Obj_Rel_Insert_Input = {
  data: Study_Stages_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Study_Stages_On_Conflict>;
};

/** on_conflict condition type for table "study_stages" */
export type Study_Stages_On_Conflict = {
  constraint: Study_Stages_Constraint;
  update_columns?: Array<Study_Stages_Update_Column>;
  where?: InputMaybe<Study_Stages_Bool_Exp>;
};

/** Ordering options when selecting data from "study_stages". */
export type Study_Stages_Order_By = {
  created_at?: InputMaybe<Order_By>;
  daily_tasks_aggregate?: InputMaybe<Daily_Tasks_Aggregate_Order_By>;
  description?: InputMaybe<Order_By>;
  end_month?: InputMaybe<Order_By>;
  focus?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  level_from?: InputMaybe<Order_By>;
  level_to?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  order_index?: InputMaybe<Order_By>;
  stage_progresses_aggregate?: InputMaybe<Stage_Progress_Aggregate_Order_By>;
  stage_requirements_aggregate?: InputMaybe<Stage_Requirements_Aggregate_Order_By>;
  stage_tests_aggregate?: InputMaybe<Stage_Tests_Aggregate_Order_By>;
  start_month?: InputMaybe<Order_By>;
  weekly_structures_aggregate?: InputMaybe<Weekly_Structure_Aggregate_Order_By>;
};

/** primary key columns input for table: study_stages */
export type Study_Stages_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "study_stages" */
export enum Study_Stages_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Description = "description",
  /** column name */
  EndMonth = "end_month",
  /** column name */
  Focus = "focus",
  /** column name */
  Id = "id",
  /** column name */
  LevelFrom = "level_from",
  /** column name */
  LevelTo = "level_to",
  /** column name */
  Name = "name",
  /** column name */
  OrderIndex = "order_index",
  /** column name */
  StartMonth = "start_month",
}

/** input type for updating data in table "study_stages" */
export type Study_Stages_Set_Input = {
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  end_month?: InputMaybe<Scalars["Int"]["input"]>;
  focus?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  level_from?: InputMaybe<Scalars["String"]["input"]>;
  level_to?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  order_index?: InputMaybe<Scalars["Int"]["input"]>;
  start_month?: InputMaybe<Scalars["Int"]["input"]>;
};

/** aggregate stddev on columns */
export type Study_Stages_Stddev_Fields = {
  __typename?: "study_stages_stddev_fields";
  end_month?: Maybe<Scalars["Float"]["output"]>;
  order_index?: Maybe<Scalars["Float"]["output"]>;
  start_month?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Study_Stages_Stddev_Pop_Fields = {
  __typename?: "study_stages_stddev_pop_fields";
  end_month?: Maybe<Scalars["Float"]["output"]>;
  order_index?: Maybe<Scalars["Float"]["output"]>;
  start_month?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Study_Stages_Stddev_Samp_Fields = {
  __typename?: "study_stages_stddev_samp_fields";
  end_month?: Maybe<Scalars["Float"]["output"]>;
  order_index?: Maybe<Scalars["Float"]["output"]>;
  start_month?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "study_stages" */
export type Study_Stages_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Study_Stages_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Study_Stages_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  end_month?: InputMaybe<Scalars["Int"]["input"]>;
  focus?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  level_from?: InputMaybe<Scalars["String"]["input"]>;
  level_to?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  order_index?: InputMaybe<Scalars["Int"]["input"]>;
  start_month?: InputMaybe<Scalars["Int"]["input"]>;
};

/** aggregate sum on columns */
export type Study_Stages_Sum_Fields = {
  __typename?: "study_stages_sum_fields";
  end_month?: Maybe<Scalars["Int"]["output"]>;
  order_index?: Maybe<Scalars["Int"]["output"]>;
  start_month?: Maybe<Scalars["Int"]["output"]>;
};

/** update columns of table "study_stages" */
export enum Study_Stages_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Description = "description",
  /** column name */
  EndMonth = "end_month",
  /** column name */
  Focus = "focus",
  /** column name */
  Id = "id",
  /** column name */
  LevelFrom = "level_from",
  /** column name */
  LevelTo = "level_to",
  /** column name */
  Name = "name",
  /** column name */
  OrderIndex = "order_index",
  /** column name */
  StartMonth = "start_month",
}

export type Study_Stages_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Study_Stages_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Study_Stages_Set_Input>;
  /** filter the rows which have to be updated */
  where: Study_Stages_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Study_Stages_Var_Pop_Fields = {
  __typename?: "study_stages_var_pop_fields";
  end_month?: Maybe<Scalars["Float"]["output"]>;
  order_index?: Maybe<Scalars["Float"]["output"]>;
  start_month?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Study_Stages_Var_Samp_Fields = {
  __typename?: "study_stages_var_samp_fields";
  end_month?: Maybe<Scalars["Float"]["output"]>;
  order_index?: Maybe<Scalars["Float"]["output"]>;
  start_month?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Study_Stages_Variance_Fields = {
  __typename?: "study_stages_variance_fields";
  end_month?: Maybe<Scalars["Float"]["output"]>;
  order_index?: Maybe<Scalars["Float"]["output"]>;
  start_month?: Maybe<Scalars["Float"]["output"]>;
};

export type Subscription_Root = {
  __typename?: "subscription_root";
  /** An array relationship */
  accounts: Array<Accounts>;
  /** An aggregate relationship */
  accounts_aggregate: Accounts_Aggregate;
  /** fetch data from the table: "accounts" using primary key columns */
  accounts_by_pk?: Maybe<Accounts>;
  /** fetch data from the table in a streaming manner: "accounts" */
  accounts_stream: Array<Accounts>;
  /** An array relationship */
  achievements: Array<Achievements>;
  /** An aggregate relationship */
  achievements_aggregate: Achievements_Aggregate;
  /** fetch data from the table: "achievements" using primary key columns */
  achievements_by_pk?: Maybe<Achievements>;
  /** fetch data from the table in a streaming manner: "achievements" */
  achievements_stream: Array<Achievements>;
  /** An array relationship */
  ai_sessions: Array<Ai_Sessions>;
  /** An aggregate relationship */
  ai_sessions_aggregate: Ai_Sessions_Aggregate;
  /** fetch data from the table: "ai_sessions" using primary key columns */
  ai_sessions_by_pk?: Maybe<Ai_Sessions>;
  /** fetch data from the table in a streaming manner: "ai_sessions" */
  ai_sessions_stream: Array<Ai_Sessions>;
  /** fetch data from the table: "auth_jwt" */
  auth_jwt: Array<Auth_Jwt>;
  /** fetch aggregated fields from the table: "auth_jwt" */
  auth_jwt_aggregate: Auth_Jwt_Aggregate;
  /** fetch data from the table: "auth_jwt" using primary key columns */
  auth_jwt_by_pk?: Maybe<Auth_Jwt>;
  /** fetch data from the table in a streaming manner: "auth_jwt" */
  auth_jwt_stream: Array<Auth_Jwt>;
  /** fetch data from the table: "storage.buckets" using primary key columns */
  bucket?: Maybe<Buckets>;
  /** fetch data from the table: "storage.buckets" */
  buckets: Array<Buckets>;
  /** fetch aggregated fields from the table: "storage.buckets" */
  bucketsAggregate: Buckets_Aggregate;
  /** fetch data from the table in a streaming manner: "storage.buckets" */
  buckets_stream: Array<Buckets>;
  /** An array relationship */
  daily_tasks: Array<Daily_Tasks>;
  /** An aggregate relationship */
  daily_tasks_aggregate: Daily_Tasks_Aggregate;
  /** fetch data from the table: "daily_tasks" using primary key columns */
  daily_tasks_by_pk?: Maybe<Daily_Tasks>;
  /** fetch data from the table in a streaming manner: "daily_tasks" */
  daily_tasks_stream: Array<Daily_Tasks>;
  /** fetch data from the table: "debug" */
  debug: Array<Debug>;
  /** fetch aggregated fields from the table: "debug" */
  debug_aggregate: Debug_Aggregate;
  /** fetch data from the table: "debug" using primary key columns */
  debug_by_pk?: Maybe<Debug>;
  /** fetch data from the table in a streaming manner: "debug" */
  debug_stream: Array<Debug>;
  /** fetch data from the table: "error_log" */
  error_log: Array<Error_Log>;
  /** fetch aggregated fields from the table: "error_log" */
  error_log_aggregate: Error_Log_Aggregate;
  /** fetch data from the table: "error_log" using primary key columns */
  error_log_by_pk?: Maybe<Error_Log>;
  /** fetch data from the table in a streaming manner: "error_log" */
  error_log_stream: Array<Error_Log>;
  /** fetch data from the table: "storage.files" using primary key columns */
  file?: Maybe<Files>;
  /** fetch data from the table: "storage.files_blob" using primary key columns */
  fileBlob?: Maybe<FilesBlob>;
  /** An array relationship */
  files: Array<Files>;
  /** fetch aggregated fields from the table: "storage.files" */
  filesAggregate: Files_Aggregate;
  /** fetch aggregated fields from the table: "storage.files_blob" */
  filesBlob_aggregate: FilesBlob_Aggregate;
  /** fetch data from the table in a streaming manner: "storage.files_blob" */
  filesBlob_stream: Array<FilesBlob>;
  /** fetch data from the table: "storage.files_blob" */
  filesBlobs: Array<FilesBlob>;
  /** fetch data from the table in a streaming manner: "storage.files" */
  files_stream: Array<Files>;
  /** fetch data from the table: "github_issues" */
  github_issues: Array<Github_Issues>;
  /** fetch aggregated fields from the table: "github_issues" */
  github_issues_aggregate: Github_Issues_Aggregate;
  /** fetch data from the table: "github_issues" using primary key columns */
  github_issues_by_pk?: Maybe<Github_Issues>;
  /** fetch data from the table in a streaming manner: "github_issues" */
  github_issues_stream: Array<Github_Issues>;
  /** fetch data from the table: "invites" */
  invites: Array<Invites>;
  /** fetch aggregated fields from the table: "invites" */
  invites_aggregate: Invites_Aggregate;
  /** fetch data from the table: "invites" using primary key columns */
  invites_by_pk?: Maybe<Invites>;
  /** fetch data from the table in a streaming manner: "invites" */
  invites_stream: Array<Invites>;
  /** fetch data from the table: "logs.diffs" */
  logs_diffs: Array<Logs_Diffs>;
  /** fetch aggregated fields from the table: "logs.diffs" */
  logs_diffs_aggregate: Logs_Diffs_Aggregate;
  /** fetch data from the table: "logs.diffs" using primary key columns */
  logs_diffs_by_pk?: Maybe<Logs_Diffs>;
  /** fetch data from the table in a streaming manner: "logs.diffs" */
  logs_diffs_stream: Array<Logs_Diffs>;
  /** An array relationship */
  notification_messages: Array<Notification_Messages>;
  /** An aggregate relationship */
  notification_messages_aggregate: Notification_Messages_Aggregate;
  /** fetch data from the table: "notification_messages" using primary key columns */
  notification_messages_by_pk?: Maybe<Notification_Messages>;
  /** fetch data from the table in a streaming manner: "notification_messages" */
  notification_messages_stream: Array<Notification_Messages>;
  /** An array relationship */
  notification_permissions: Array<Notification_Permissions>;
  /** An aggregate relationship */
  notification_permissions_aggregate: Notification_Permissions_Aggregate;
  /** fetch data from the table: "notification_permissions" using primary key columns */
  notification_permissions_by_pk?: Maybe<Notification_Permissions>;
  /** fetch data from the table in a streaming manner: "notification_permissions" */
  notification_permissions_stream: Array<Notification_Permissions>;
  /** An array relationship */
  notifications: Array<Notifications>;
  /** An aggregate relationship */
  notifications_aggregate: Notifications_Aggregate;
  /** fetch data from the table: "notifications" using primary key columns */
  notifications_by_pk?: Maybe<Notifications>;
  /** fetch data from the table in a streaming manner: "notifications" */
  notifications_stream: Array<Notifications>;
  /** fetch data from the table: "payments.methods" */
  payments_methods: Array<Payments_Methods>;
  /** fetch aggregated fields from the table: "payments.methods" */
  payments_methods_aggregate: Payments_Methods_Aggregate;
  /** fetch data from the table: "payments.methods" using primary key columns */
  payments_methods_by_pk?: Maybe<Payments_Methods>;
  /** fetch data from the table in a streaming manner: "payments.methods" */
  payments_methods_stream: Array<Payments_Methods>;
  /** fetch data from the table: "payments.operations" */
  payments_operations: Array<Payments_Operations>;
  /** fetch aggregated fields from the table: "payments.operations" */
  payments_operations_aggregate: Payments_Operations_Aggregate;
  /** fetch data from the table: "payments.operations" using primary key columns */
  payments_operations_by_pk?: Maybe<Payments_Operations>;
  /** fetch data from the table in a streaming manner: "payments.operations" */
  payments_operations_stream: Array<Payments_Operations>;
  /** fetch data from the table: "payments.plans" */
  payments_plans: Array<Payments_Plans>;
  /** fetch aggregated fields from the table: "payments.plans" */
  payments_plans_aggregate: Payments_Plans_Aggregate;
  /** fetch data from the table: "payments.plans" using primary key columns */
  payments_plans_by_pk?: Maybe<Payments_Plans>;
  /** fetch data from the table in a streaming manner: "payments.plans" */
  payments_plans_stream: Array<Payments_Plans>;
  /** fetch data from the table: "payments.providers" */
  payments_providers: Array<Payments_Providers>;
  /** fetch aggregated fields from the table: "payments.providers" */
  payments_providers_aggregate: Payments_Providers_Aggregate;
  /** fetch data from the table: "payments.providers" using primary key columns */
  payments_providers_by_pk?: Maybe<Payments_Providers>;
  /** fetch data from the table in a streaming manner: "payments.providers" */
  payments_providers_stream: Array<Payments_Providers>;
  /** fetch data from the table: "payments.subscriptions" */
  payments_subscriptions: Array<Payments_Subscriptions>;
  /** fetch aggregated fields from the table: "payments.subscriptions" */
  payments_subscriptions_aggregate: Payments_Subscriptions_Aggregate;
  /** fetch data from the table: "payments.subscriptions" using primary key columns */
  payments_subscriptions_by_pk?: Maybe<Payments_Subscriptions>;
  /** fetch data from the table in a streaming manner: "payments.subscriptions" */
  payments_subscriptions_stream: Array<Payments_Subscriptions>;
  /** fetch data from the table: "payments.user_payment_provider_mappings" */
  payments_user_payment_provider_mappings: Array<Payments_User_Payment_Provider_Mappings>;
  /** fetch aggregated fields from the table: "payments.user_payment_provider_mappings" */
  payments_user_payment_provider_mappings_aggregate: Payments_User_Payment_Provider_Mappings_Aggregate;
  /** fetch data from the table: "payments.user_payment_provider_mappings" using primary key columns */
  payments_user_payment_provider_mappings_by_pk?: Maybe<Payments_User_Payment_Provider_Mappings>;
  /** fetch data from the table in a streaming manner: "payments.user_payment_provider_mappings" */
  payments_user_payment_provider_mappings_stream: Array<Payments_User_Payment_Provider_Mappings>;
  /** An array relationship */
  progress_metrics: Array<Progress_Metrics>;
  /** An aggregate relationship */
  progress_metrics_aggregate: Progress_Metrics_Aggregate;
  /** fetch data from the table: "progress_metrics" using primary key columns */
  progress_metrics_by_pk?: Maybe<Progress_Metrics>;
  /** fetch data from the table in a streaming manner: "progress_metrics" */
  progress_metrics_stream: Array<Progress_Metrics>;
  /** fetch data from the table: "review_history" */
  review_history: Array<Review_History>;
  /** fetch aggregated fields from the table: "review_history" */
  review_history_aggregate: Review_History_Aggregate;
  /** fetch data from the table: "review_history" using primary key columns */
  review_history_by_pk?: Maybe<Review_History>;
  /** fetch data from the table in a streaming manner: "review_history" */
  review_history_stream: Array<Review_History>;
  /** fetch data from the table: "stage_progress" */
  stage_progress: Array<Stage_Progress>;
  /** fetch aggregated fields from the table: "stage_progress" */
  stage_progress_aggregate: Stage_Progress_Aggregate;
  /** fetch data from the table: "stage_progress" using primary key columns */
  stage_progress_by_pk?: Maybe<Stage_Progress>;
  /** fetch data from the table in a streaming manner: "stage_progress" */
  stage_progress_stream: Array<Stage_Progress>;
  /** An array relationship */
  stage_requirements: Array<Stage_Requirements>;
  /** An aggregate relationship */
  stage_requirements_aggregate: Stage_Requirements_Aggregate;
  /** fetch data from the table: "stage_requirements" using primary key columns */
  stage_requirements_by_pk?: Maybe<Stage_Requirements>;
  /** fetch data from the table in a streaming manner: "stage_requirements" */
  stage_requirements_stream: Array<Stage_Requirements>;
  /** An array relationship */
  stage_tests: Array<Stage_Tests>;
  /** An aggregate relationship */
  stage_tests_aggregate: Stage_Tests_Aggregate;
  /** fetch data from the table: "stage_tests" using primary key columns */
  stage_tests_by_pk?: Maybe<Stage_Tests>;
  /** fetch data from the table in a streaming manner: "stage_tests" */
  stage_tests_stream: Array<Stage_Tests>;
  /** fetch data from the table: "streaks" */
  streaks: Array<Streaks>;
  /** fetch aggregated fields from the table: "streaks" */
  streaks_aggregate: Streaks_Aggregate;
  /** fetch data from the table: "streaks" using primary key columns */
  streaks_by_pk?: Maybe<Streaks>;
  /** fetch data from the table in a streaming manner: "streaks" */
  streaks_stream: Array<Streaks>;
  /** fetch data from the table: "study_stages" */
  study_stages: Array<Study_Stages>;
  /** fetch aggregated fields from the table: "study_stages" */
  study_stages_aggregate: Study_Stages_Aggregate;
  /** fetch data from the table: "study_stages" using primary key columns */
  study_stages_by_pk?: Maybe<Study_Stages>;
  /** fetch data from the table in a streaming manner: "study_stages" */
  study_stages_stream: Array<Study_Stages>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
  /** fetch data from the table in a streaming manner: "users" */
  users_stream: Array<Users>;
  /** fetch data from the table: "verification_codes" */
  verification_codes: Array<Verification_Codes>;
  /** fetch aggregated fields from the table: "verification_codes" */
  verification_codes_aggregate: Verification_Codes_Aggregate;
  /** fetch data from the table: "verification_codes" using primary key columns */
  verification_codes_by_pk?: Maybe<Verification_Codes>;
  /** fetch data from the table in a streaming manner: "verification_codes" */
  verification_codes_stream: Array<Verification_Codes>;
  /** fetch data from the table: "storage.virus" using primary key columns */
  virus?: Maybe<Virus>;
  /** fetch data from the table in a streaming manner: "storage.virus" */
  virus_stream: Array<Virus>;
  /** fetch data from the table: "storage.virus" */
  viruses: Array<Virus>;
  /** fetch aggregated fields from the table: "storage.virus" */
  virusesAggregate: Virus_Aggregate;
  /** An array relationship */
  vocabulary_cards: Array<Vocabulary_Cards>;
  /** An aggregate relationship */
  vocabulary_cards_aggregate: Vocabulary_Cards_Aggregate;
  /** fetch data from the table: "vocabulary_cards" using primary key columns */
  vocabulary_cards_by_pk?: Maybe<Vocabulary_Cards>;
  /** fetch data from the table in a streaming manner: "vocabulary_cards" */
  vocabulary_cards_stream: Array<Vocabulary_Cards>;
  /** fetch data from the table: "weekly_structure" */
  weekly_structure: Array<Weekly_Structure>;
  /** fetch aggregated fields from the table: "weekly_structure" */
  weekly_structure_aggregate: Weekly_Structure_Aggregate;
  /** fetch data from the table: "weekly_structure" using primary key columns */
  weekly_structure_by_pk?: Maybe<Weekly_Structure>;
  /** fetch data from the table in a streaming manner: "weekly_structure" */
  weekly_structure_stream: Array<Weekly_Structure>;
};

export type Subscription_RootAccountsArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};

export type Subscription_RootAccounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};

export type Subscription_RootAccounts_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootAccounts_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Accounts_Stream_Cursor_Input>>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};

export type Subscription_RootAchievementsArgs = {
  distinct_on?: InputMaybe<Array<Achievements_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Achievements_Order_By>>;
  where?: InputMaybe<Achievements_Bool_Exp>;
};

export type Subscription_RootAchievements_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Achievements_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Achievements_Order_By>>;
  where?: InputMaybe<Achievements_Bool_Exp>;
};

export type Subscription_RootAchievements_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootAchievements_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Achievements_Stream_Cursor_Input>>;
  where?: InputMaybe<Achievements_Bool_Exp>;
};

export type Subscription_RootAi_SessionsArgs = {
  distinct_on?: InputMaybe<Array<Ai_Sessions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Ai_Sessions_Order_By>>;
  where?: InputMaybe<Ai_Sessions_Bool_Exp>;
};

export type Subscription_RootAi_Sessions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Ai_Sessions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Ai_Sessions_Order_By>>;
  where?: InputMaybe<Ai_Sessions_Bool_Exp>;
};

export type Subscription_RootAi_Sessions_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootAi_Sessions_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Ai_Sessions_Stream_Cursor_Input>>;
  where?: InputMaybe<Ai_Sessions_Bool_Exp>;
};

export type Subscription_RootAuth_JwtArgs = {
  distinct_on?: InputMaybe<Array<Auth_Jwt_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Jwt_Order_By>>;
  where?: InputMaybe<Auth_Jwt_Bool_Exp>;
};

export type Subscription_RootAuth_Jwt_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Auth_Jwt_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Jwt_Order_By>>;
  where?: InputMaybe<Auth_Jwt_Bool_Exp>;
};

export type Subscription_RootAuth_Jwt_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootAuth_Jwt_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Auth_Jwt_Stream_Cursor_Input>>;
  where?: InputMaybe<Auth_Jwt_Bool_Exp>;
};

export type Subscription_RootBucketArgs = {
  id: Scalars["String"]["input"];
};

export type Subscription_RootBucketsArgs = {
  distinct_on?: InputMaybe<Array<Buckets_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Buckets_Order_By>>;
  where?: InputMaybe<Buckets_Bool_Exp>;
};

export type Subscription_RootBucketsAggregateArgs = {
  distinct_on?: InputMaybe<Array<Buckets_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Buckets_Order_By>>;
  where?: InputMaybe<Buckets_Bool_Exp>;
};

export type Subscription_RootBuckets_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Buckets_Stream_Cursor_Input>>;
  where?: InputMaybe<Buckets_Bool_Exp>;
};

export type Subscription_RootDaily_TasksArgs = {
  distinct_on?: InputMaybe<Array<Daily_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Daily_Tasks_Order_By>>;
  where?: InputMaybe<Daily_Tasks_Bool_Exp>;
};

export type Subscription_RootDaily_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Daily_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Daily_Tasks_Order_By>>;
  where?: InputMaybe<Daily_Tasks_Bool_Exp>;
};

export type Subscription_RootDaily_Tasks_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootDaily_Tasks_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Daily_Tasks_Stream_Cursor_Input>>;
  where?: InputMaybe<Daily_Tasks_Bool_Exp>;
};

export type Subscription_RootDebugArgs = {
  distinct_on?: InputMaybe<Array<Debug_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Debug_Order_By>>;
  where?: InputMaybe<Debug_Bool_Exp>;
};

export type Subscription_RootDebug_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Debug_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Debug_Order_By>>;
  where?: InputMaybe<Debug_Bool_Exp>;
};

export type Subscription_RootDebug_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootDebug_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Debug_Stream_Cursor_Input>>;
  where?: InputMaybe<Debug_Bool_Exp>;
};

export type Subscription_RootError_LogArgs = {
  distinct_on?: InputMaybe<Array<Error_Log_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Error_Log_Order_By>>;
  where?: InputMaybe<Error_Log_Bool_Exp>;
};

export type Subscription_RootError_Log_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Error_Log_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Error_Log_Order_By>>;
  where?: InputMaybe<Error_Log_Bool_Exp>;
};

export type Subscription_RootError_Log_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootError_Log_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Error_Log_Stream_Cursor_Input>>;
  where?: InputMaybe<Error_Log_Bool_Exp>;
};

export type Subscription_RootFileArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootFileBlobArgs = {
  fileId: Scalars["uuid"]["input"];
};

export type Subscription_RootFilesArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};

export type Subscription_RootFilesAggregateArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};

export type Subscription_RootFilesBlob_AggregateArgs = {
  distinct_on?: InputMaybe<Array<FilesBlob_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<FilesBlob_Order_By>>;
  where?: InputMaybe<FilesBlob_Bool_Exp>;
};

export type Subscription_RootFilesBlob_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<FilesBlob_Stream_Cursor_Input>>;
  where?: InputMaybe<FilesBlob_Bool_Exp>;
};

export type Subscription_RootFilesBlobsArgs = {
  distinct_on?: InputMaybe<Array<FilesBlob_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<FilesBlob_Order_By>>;
  where?: InputMaybe<FilesBlob_Bool_Exp>;
};

export type Subscription_RootFiles_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Files_Stream_Cursor_Input>>;
  where?: InputMaybe<Files_Bool_Exp>;
};

export type Subscription_RootGithub_IssuesArgs = {
  distinct_on?: InputMaybe<Array<Github_Issues_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Github_Issues_Order_By>>;
  where?: InputMaybe<Github_Issues_Bool_Exp>;
};

export type Subscription_RootGithub_Issues_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Github_Issues_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Github_Issues_Order_By>>;
  where?: InputMaybe<Github_Issues_Bool_Exp>;
};

export type Subscription_RootGithub_Issues_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootGithub_Issues_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Github_Issues_Stream_Cursor_Input>>;
  where?: InputMaybe<Github_Issues_Bool_Exp>;
};

export type Subscription_RootInvitesArgs = {
  distinct_on?: InputMaybe<Array<Invites_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Invites_Order_By>>;
  where?: InputMaybe<Invites_Bool_Exp>;
};

export type Subscription_RootInvites_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Invites_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Invites_Order_By>>;
  where?: InputMaybe<Invites_Bool_Exp>;
};

export type Subscription_RootInvites_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootInvites_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Invites_Stream_Cursor_Input>>;
  where?: InputMaybe<Invites_Bool_Exp>;
};

export type Subscription_RootLogs_DiffsArgs = {
  distinct_on?: InputMaybe<Array<Logs_Diffs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Logs_Diffs_Order_By>>;
  where?: InputMaybe<Logs_Diffs_Bool_Exp>;
};

export type Subscription_RootLogs_Diffs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Logs_Diffs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Logs_Diffs_Order_By>>;
  where?: InputMaybe<Logs_Diffs_Bool_Exp>;
};

export type Subscription_RootLogs_Diffs_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootLogs_Diffs_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Logs_Diffs_Stream_Cursor_Input>>;
  where?: InputMaybe<Logs_Diffs_Bool_Exp>;
};

export type Subscription_RootNotification_MessagesArgs = {
  distinct_on?: InputMaybe<Array<Notification_Messages_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notification_Messages_Order_By>>;
  where?: InputMaybe<Notification_Messages_Bool_Exp>;
};

export type Subscription_RootNotification_Messages_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notification_Messages_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notification_Messages_Order_By>>;
  where?: InputMaybe<Notification_Messages_Bool_Exp>;
};

export type Subscription_RootNotification_Messages_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootNotification_Messages_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Notification_Messages_Stream_Cursor_Input>>;
  where?: InputMaybe<Notification_Messages_Bool_Exp>;
};

export type Subscription_RootNotification_PermissionsArgs = {
  distinct_on?: InputMaybe<Array<Notification_Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notification_Permissions_Order_By>>;
  where?: InputMaybe<Notification_Permissions_Bool_Exp>;
};

export type Subscription_RootNotification_Permissions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notification_Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notification_Permissions_Order_By>>;
  where?: InputMaybe<Notification_Permissions_Bool_Exp>;
};

export type Subscription_RootNotification_Permissions_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootNotification_Permissions_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Notification_Permissions_Stream_Cursor_Input>>;
  where?: InputMaybe<Notification_Permissions_Bool_Exp>;
};

export type Subscription_RootNotificationsArgs = {
  distinct_on?: InputMaybe<Array<Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notifications_Order_By>>;
  where?: InputMaybe<Notifications_Bool_Exp>;
};

export type Subscription_RootNotifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notifications_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notifications_Order_By>>;
  where?: InputMaybe<Notifications_Bool_Exp>;
};

export type Subscription_RootNotifications_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootNotifications_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Notifications_Stream_Cursor_Input>>;
  where?: InputMaybe<Notifications_Bool_Exp>;
};

export type Subscription_RootPayments_MethodsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Methods_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Methods_Order_By>>;
  where?: InputMaybe<Payments_Methods_Bool_Exp>;
};

export type Subscription_RootPayments_Methods_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Methods_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Methods_Order_By>>;
  where?: InputMaybe<Payments_Methods_Bool_Exp>;
};

export type Subscription_RootPayments_Methods_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootPayments_Methods_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Payments_Methods_Stream_Cursor_Input>>;
  where?: InputMaybe<Payments_Methods_Bool_Exp>;
};

export type Subscription_RootPayments_OperationsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Operations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Operations_Order_By>>;
  where?: InputMaybe<Payments_Operations_Bool_Exp>;
};

export type Subscription_RootPayments_Operations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Operations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Operations_Order_By>>;
  where?: InputMaybe<Payments_Operations_Bool_Exp>;
};

export type Subscription_RootPayments_Operations_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootPayments_Operations_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Payments_Operations_Stream_Cursor_Input>>;
  where?: InputMaybe<Payments_Operations_Bool_Exp>;
};

export type Subscription_RootPayments_PlansArgs = {
  distinct_on?: InputMaybe<Array<Payments_Plans_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Plans_Order_By>>;
  where?: InputMaybe<Payments_Plans_Bool_Exp>;
};

export type Subscription_RootPayments_Plans_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Plans_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Plans_Order_By>>;
  where?: InputMaybe<Payments_Plans_Bool_Exp>;
};

export type Subscription_RootPayments_Plans_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootPayments_Plans_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Payments_Plans_Stream_Cursor_Input>>;
  where?: InputMaybe<Payments_Plans_Bool_Exp>;
};

export type Subscription_RootPayments_ProvidersArgs = {
  distinct_on?: InputMaybe<Array<Payments_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Providers_Order_By>>;
  where?: InputMaybe<Payments_Providers_Bool_Exp>;
};

export type Subscription_RootPayments_Providers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Providers_Order_By>>;
  where?: InputMaybe<Payments_Providers_Bool_Exp>;
};

export type Subscription_RootPayments_Providers_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootPayments_Providers_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Payments_Providers_Stream_Cursor_Input>>;
  where?: InputMaybe<Payments_Providers_Bool_Exp>;
};

export type Subscription_RootPayments_SubscriptionsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Subscriptions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Subscriptions_Order_By>>;
  where?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
};

export type Subscription_RootPayments_Subscriptions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Subscriptions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Subscriptions_Order_By>>;
  where?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
};

export type Subscription_RootPayments_Subscriptions_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootPayments_Subscriptions_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Payments_Subscriptions_Stream_Cursor_Input>>;
  where?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
};

export type Subscription_RootPayments_User_Payment_Provider_MappingsArgs = {
  distinct_on?: InputMaybe<
    Array<Payments_User_Payment_Provider_Mappings_Select_Column>
  >;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<
    Array<Payments_User_Payment_Provider_Mappings_Order_By>
  >;
  where?: InputMaybe<Payments_User_Payment_Provider_Mappings_Bool_Exp>;
};

export type Subscription_RootPayments_User_Payment_Provider_Mappings_AggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<Payments_User_Payment_Provider_Mappings_Select_Column>
    >;
    limit?: InputMaybe<Scalars["Int"]["input"]>;
    offset?: InputMaybe<Scalars["Int"]["input"]>;
    order_by?: InputMaybe<
      Array<Payments_User_Payment_Provider_Mappings_Order_By>
    >;
    where?: InputMaybe<Payments_User_Payment_Provider_Mappings_Bool_Exp>;
  };

export type Subscription_RootPayments_User_Payment_Provider_Mappings_By_PkArgs =
  {
    id: Scalars["uuid"]["input"];
  };

export type Subscription_RootPayments_User_Payment_Provider_Mappings_StreamArgs =
  {
    batch_size: Scalars["Int"]["input"];
    cursor: Array<
      InputMaybe<Payments_User_Payment_Provider_Mappings_Stream_Cursor_Input>
    >;
    where?: InputMaybe<Payments_User_Payment_Provider_Mappings_Bool_Exp>;
  };

export type Subscription_RootProgress_MetricsArgs = {
  distinct_on?: InputMaybe<Array<Progress_Metrics_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Progress_Metrics_Order_By>>;
  where?: InputMaybe<Progress_Metrics_Bool_Exp>;
};

export type Subscription_RootProgress_Metrics_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Progress_Metrics_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Progress_Metrics_Order_By>>;
  where?: InputMaybe<Progress_Metrics_Bool_Exp>;
};

export type Subscription_RootProgress_Metrics_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootProgress_Metrics_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Progress_Metrics_Stream_Cursor_Input>>;
  where?: InputMaybe<Progress_Metrics_Bool_Exp>;
};

export type Subscription_RootReview_HistoryArgs = {
  distinct_on?: InputMaybe<Array<Review_History_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Review_History_Order_By>>;
  where?: InputMaybe<Review_History_Bool_Exp>;
};

export type Subscription_RootReview_History_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Review_History_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Review_History_Order_By>>;
  where?: InputMaybe<Review_History_Bool_Exp>;
};

export type Subscription_RootReview_History_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootReview_History_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Review_History_Stream_Cursor_Input>>;
  where?: InputMaybe<Review_History_Bool_Exp>;
};

export type Subscription_RootStage_ProgressArgs = {
  distinct_on?: InputMaybe<Array<Stage_Progress_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Stage_Progress_Order_By>>;
  where?: InputMaybe<Stage_Progress_Bool_Exp>;
};

export type Subscription_RootStage_Progress_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Stage_Progress_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Stage_Progress_Order_By>>;
  where?: InputMaybe<Stage_Progress_Bool_Exp>;
};

export type Subscription_RootStage_Progress_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootStage_Progress_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Stage_Progress_Stream_Cursor_Input>>;
  where?: InputMaybe<Stage_Progress_Bool_Exp>;
};

export type Subscription_RootStage_RequirementsArgs = {
  distinct_on?: InputMaybe<Array<Stage_Requirements_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Stage_Requirements_Order_By>>;
  where?: InputMaybe<Stage_Requirements_Bool_Exp>;
};

export type Subscription_RootStage_Requirements_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Stage_Requirements_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Stage_Requirements_Order_By>>;
  where?: InputMaybe<Stage_Requirements_Bool_Exp>;
};

export type Subscription_RootStage_Requirements_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootStage_Requirements_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Stage_Requirements_Stream_Cursor_Input>>;
  where?: InputMaybe<Stage_Requirements_Bool_Exp>;
};

export type Subscription_RootStage_TestsArgs = {
  distinct_on?: InputMaybe<Array<Stage_Tests_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Stage_Tests_Order_By>>;
  where?: InputMaybe<Stage_Tests_Bool_Exp>;
};

export type Subscription_RootStage_Tests_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Stage_Tests_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Stage_Tests_Order_By>>;
  where?: InputMaybe<Stage_Tests_Bool_Exp>;
};

export type Subscription_RootStage_Tests_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootStage_Tests_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Stage_Tests_Stream_Cursor_Input>>;
  where?: InputMaybe<Stage_Tests_Bool_Exp>;
};

export type Subscription_RootStreaksArgs = {
  distinct_on?: InputMaybe<Array<Streaks_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Streaks_Order_By>>;
  where?: InputMaybe<Streaks_Bool_Exp>;
};

export type Subscription_RootStreaks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Streaks_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Streaks_Order_By>>;
  where?: InputMaybe<Streaks_Bool_Exp>;
};

export type Subscription_RootStreaks_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootStreaks_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Streaks_Stream_Cursor_Input>>;
  where?: InputMaybe<Streaks_Bool_Exp>;
};

export type Subscription_RootStudy_StagesArgs = {
  distinct_on?: InputMaybe<Array<Study_Stages_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Study_Stages_Order_By>>;
  where?: InputMaybe<Study_Stages_Bool_Exp>;
};

export type Subscription_RootStudy_Stages_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Study_Stages_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Study_Stages_Order_By>>;
  where?: InputMaybe<Study_Stages_Bool_Exp>;
};

export type Subscription_RootStudy_Stages_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootStudy_Stages_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Study_Stages_Stream_Cursor_Input>>;
  where?: InputMaybe<Study_Stages_Bool_Exp>;
};

export type Subscription_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Subscription_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Subscription_RootUsers_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootUsers_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Users_Stream_Cursor_Input>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Subscription_RootVerification_CodesArgs = {
  distinct_on?: InputMaybe<Array<Verification_Codes_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Verification_Codes_Order_By>>;
  where?: InputMaybe<Verification_Codes_Bool_Exp>;
};

export type Subscription_RootVerification_Codes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Verification_Codes_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Verification_Codes_Order_By>>;
  where?: InputMaybe<Verification_Codes_Bool_Exp>;
};

export type Subscription_RootVerification_Codes_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootVerification_Codes_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Verification_Codes_Stream_Cursor_Input>>;
  where?: InputMaybe<Verification_Codes_Bool_Exp>;
};

export type Subscription_RootVirusArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootVirus_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Virus_Stream_Cursor_Input>>;
  where?: InputMaybe<Virus_Bool_Exp>;
};

export type Subscription_RootVirusesArgs = {
  distinct_on?: InputMaybe<Array<Virus_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Virus_Order_By>>;
  where?: InputMaybe<Virus_Bool_Exp>;
};

export type Subscription_RootVirusesAggregateArgs = {
  distinct_on?: InputMaybe<Array<Virus_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Virus_Order_By>>;
  where?: InputMaybe<Virus_Bool_Exp>;
};

export type Subscription_RootVocabulary_CardsArgs = {
  distinct_on?: InputMaybe<Array<Vocabulary_Cards_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Vocabulary_Cards_Order_By>>;
  where?: InputMaybe<Vocabulary_Cards_Bool_Exp>;
};

export type Subscription_RootVocabulary_Cards_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vocabulary_Cards_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Vocabulary_Cards_Order_By>>;
  where?: InputMaybe<Vocabulary_Cards_Bool_Exp>;
};

export type Subscription_RootVocabulary_Cards_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootVocabulary_Cards_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Vocabulary_Cards_Stream_Cursor_Input>>;
  where?: InputMaybe<Vocabulary_Cards_Bool_Exp>;
};

export type Subscription_RootWeekly_StructureArgs = {
  distinct_on?: InputMaybe<Array<Weekly_Structure_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Weekly_Structure_Order_By>>;
  where?: InputMaybe<Weekly_Structure_Bool_Exp>;
};

export type Subscription_RootWeekly_Structure_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Weekly_Structure_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Weekly_Structure_Order_By>>;
  where?: InputMaybe<Weekly_Structure_Bool_Exp>;
};

export type Subscription_RootWeekly_Structure_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootWeekly_Structure_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Weekly_Structure_Stream_Cursor_Input>>;
  where?: InputMaybe<Weekly_Structure_Bool_Exp>;
};

/** Boolean expression to compare columns of type "time". All fields are combined with logical 'AND'. */
export type Time_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["time"]["input"]>;
  _gt?: InputMaybe<Scalars["time"]["input"]>;
  _gte?: InputMaybe<Scalars["time"]["input"]>;
  _in?: InputMaybe<Array<Scalars["time"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["time"]["input"]>;
  _lte?: InputMaybe<Scalars["time"]["input"]>;
  _neq?: InputMaybe<Scalars["time"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["time"]["input"]>>;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["timestamp"]["input"]>;
  _gt?: InputMaybe<Scalars["timestamp"]["input"]>;
  _gte?: InputMaybe<Scalars["timestamp"]["input"]>;
  _in?: InputMaybe<Array<Scalars["timestamp"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["timestamp"]["input"]>;
  _lte?: InputMaybe<Scalars["timestamp"]["input"]>;
  _neq?: InputMaybe<Scalars["timestamp"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["timestamp"]["input"]>>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _gt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _gte?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _in?: InputMaybe<Array<Scalars["timestamptz"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _lte?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _neq?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["timestamptz"]["input"]>>;
};

/** columns and relationships of "users" */
export type Users = {
  __typename?: "users";
  /** An array relationship */
  accounts: Array<Accounts>;
  /** An aggregate relationship */
  accounts_aggregate: Accounts_Aggregate;
  /** An array relationship */
  achievements: Array<Achievements>;
  /** An aggregate relationship */
  achievements_aggregate: Achievements_Aggregate;
  /** An array relationship */
  ai_sessions: Array<Ai_Sessions>;
  /** An aggregate relationship */
  ai_sessions_aggregate: Ai_Sessions_Aggregate;
  created_at: Scalars["bigint"]["output"];
  current_level?: Maybe<Scalars["String"]["output"]>;
  daily_goal_minutes?: Maybe<Scalars["Int"]["output"]>;
  /** An array relationship */
  daily_tasks: Array<Daily_Tasks>;
  /** An aggregate relationship */
  daily_tasks_aggregate: Daily_Tasks_Aggregate;
  /** User email address */
  email?: Maybe<Scalars["String"]["output"]>;
  /** Email verification timestamp */
  email_verified?: Maybe<Scalars["bigint"]["output"]>;
  /** An array relationship */
  error_logs: Array<Error_Log>;
  /** An aggregate relationship */
  error_logs_aggregate: Error_Log_Aggregate;
  exam_date?: Maybe<Scalars["date"]["output"]>;
  /** Hasura role for permissions */
  hasura_role?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["uuid"]["output"];
  /** User profile image URL */
  image?: Maybe<Scalars["String"]["output"]>;
  /** Admin flag */
  is_admin?: Maybe<Scalars["Boolean"]["output"]>;
  /** An array relationship */
  methods: Array<Payments_Methods>;
  /** An aggregate relationship */
  methods_aggregate: Payments_Methods_Aggregate;
  /** User display name */
  name?: Maybe<Scalars["String"]["output"]>;
  /** An array relationship */
  notification_messages: Array<Notification_Messages>;
  /** An aggregate relationship */
  notification_messages_aggregate: Notification_Messages_Aggregate;
  /** An array relationship */
  notification_permissions: Array<Notification_Permissions>;
  /** An aggregate relationship */
  notification_permissions_aggregate: Notification_Permissions_Aggregate;
  /** An array relationship */
  operations: Array<Payments_Operations>;
  /** An aggregate relationship */
  operations_aggregate: Payments_Operations_Aggregate;
  /** An array relationship */
  plans: Array<Payments_Plans>;
  /** An aggregate relationship */
  plans_aggregate: Payments_Plans_Aggregate;
  /** An array relationship */
  progress_metrics: Array<Progress_Metrics>;
  /** An aggregate relationship */
  progress_metrics_aggregate: Progress_Metrics_Aggregate;
  /** An array relationship */
  providers: Array<Payments_Providers>;
  /** An aggregate relationship */
  providers_aggregate: Payments_Providers_Aggregate;
  reminder_enabled?: Maybe<Scalars["Boolean"]["output"]>;
  /** An array relationship */
  review_histories: Array<Review_History>;
  /** An aggregate relationship */
  review_histories_aggregate: Review_History_Aggregate;
  /** An array relationship */
  stage_progresses: Array<Stage_Progress>;
  /** An aggregate relationship */
  stage_progresses_aggregate: Stage_Progress_Aggregate;
  /** An array relationship */
  stage_tests: Array<Stage_Tests>;
  /** An aggregate relationship */
  stage_tests_aggregate: Stage_Tests_Aggregate;
  start_date?: Maybe<Scalars["date"]["output"]>;
  /** An object relationship */
  streak?: Maybe<Streaks>;
  study_place?: Maybe<Scalars["String"]["output"]>;
  study_time?: Maybe<Scalars["time"]["output"]>;
  /** An array relationship */
  subscriptions: Array<Payments_Subscriptions>;
  /** An aggregate relationship */
  subscriptions_aggregate: Payments_Subscriptions_Aggregate;
  target_level?: Maybe<Scalars["String"]["output"]>;
  updated_at: Scalars["bigint"]["output"];
  /** An array relationship */
  user_payment_provider_mappings: Array<Payments_User_Payment_Provider_Mappings>;
  /** An aggregate relationship */
  user_payment_provider_mappings_aggregate: Payments_User_Payment_Provider_Mappings_Aggregate;
  /** An array relationship */
  vocabulary_cards: Array<Vocabulary_Cards>;
  /** An aggregate relationship */
  vocabulary_cards_aggregate: Vocabulary_Cards_Aggregate;
};

/** columns and relationships of "users" */
export type UsersAccountsArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersAccounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Accounts_Order_By>>;
  where?: InputMaybe<Accounts_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersAchievementsArgs = {
  distinct_on?: InputMaybe<Array<Achievements_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Achievements_Order_By>>;
  where?: InputMaybe<Achievements_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersAchievements_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Achievements_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Achievements_Order_By>>;
  where?: InputMaybe<Achievements_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersAi_SessionsArgs = {
  distinct_on?: InputMaybe<Array<Ai_Sessions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Ai_Sessions_Order_By>>;
  where?: InputMaybe<Ai_Sessions_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersAi_Sessions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Ai_Sessions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Ai_Sessions_Order_By>>;
  where?: InputMaybe<Ai_Sessions_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersDaily_TasksArgs = {
  distinct_on?: InputMaybe<Array<Daily_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Daily_Tasks_Order_By>>;
  where?: InputMaybe<Daily_Tasks_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersDaily_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Daily_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Daily_Tasks_Order_By>>;
  where?: InputMaybe<Daily_Tasks_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersError_LogsArgs = {
  distinct_on?: InputMaybe<Array<Error_Log_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Error_Log_Order_By>>;
  where?: InputMaybe<Error_Log_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersError_Logs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Error_Log_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Error_Log_Order_By>>;
  where?: InputMaybe<Error_Log_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersMethodsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Methods_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Methods_Order_By>>;
  where?: InputMaybe<Payments_Methods_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersMethods_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Methods_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Methods_Order_By>>;
  where?: InputMaybe<Payments_Methods_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersNotification_MessagesArgs = {
  distinct_on?: InputMaybe<Array<Notification_Messages_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notification_Messages_Order_By>>;
  where?: InputMaybe<Notification_Messages_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersNotification_Messages_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notification_Messages_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notification_Messages_Order_By>>;
  where?: InputMaybe<Notification_Messages_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersNotification_PermissionsArgs = {
  distinct_on?: InputMaybe<Array<Notification_Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notification_Permissions_Order_By>>;
  where?: InputMaybe<Notification_Permissions_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersNotification_Permissions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notification_Permissions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Notification_Permissions_Order_By>>;
  where?: InputMaybe<Notification_Permissions_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersOperationsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Operations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Operations_Order_By>>;
  where?: InputMaybe<Payments_Operations_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersOperations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Operations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Operations_Order_By>>;
  where?: InputMaybe<Payments_Operations_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersPlansArgs = {
  distinct_on?: InputMaybe<Array<Payments_Plans_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Plans_Order_By>>;
  where?: InputMaybe<Payments_Plans_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersPlans_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Plans_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Plans_Order_By>>;
  where?: InputMaybe<Payments_Plans_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersProgress_MetricsArgs = {
  distinct_on?: InputMaybe<Array<Progress_Metrics_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Progress_Metrics_Order_By>>;
  where?: InputMaybe<Progress_Metrics_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersProgress_Metrics_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Progress_Metrics_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Progress_Metrics_Order_By>>;
  where?: InputMaybe<Progress_Metrics_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersProvidersArgs = {
  distinct_on?: InputMaybe<Array<Payments_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Providers_Order_By>>;
  where?: InputMaybe<Payments_Providers_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersProviders_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Providers_Order_By>>;
  where?: InputMaybe<Payments_Providers_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersReview_HistoriesArgs = {
  distinct_on?: InputMaybe<Array<Review_History_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Review_History_Order_By>>;
  where?: InputMaybe<Review_History_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersReview_Histories_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Review_History_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Review_History_Order_By>>;
  where?: InputMaybe<Review_History_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersStage_ProgressesArgs = {
  distinct_on?: InputMaybe<Array<Stage_Progress_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Stage_Progress_Order_By>>;
  where?: InputMaybe<Stage_Progress_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersStage_Progresses_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Stage_Progress_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Stage_Progress_Order_By>>;
  where?: InputMaybe<Stage_Progress_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersStage_TestsArgs = {
  distinct_on?: InputMaybe<Array<Stage_Tests_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Stage_Tests_Order_By>>;
  where?: InputMaybe<Stage_Tests_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersStage_Tests_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Stage_Tests_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Stage_Tests_Order_By>>;
  where?: InputMaybe<Stage_Tests_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersSubscriptionsArgs = {
  distinct_on?: InputMaybe<Array<Payments_Subscriptions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Subscriptions_Order_By>>;
  where?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersSubscriptions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Payments_Subscriptions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Payments_Subscriptions_Order_By>>;
  where?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersUser_Payment_Provider_MappingsArgs = {
  distinct_on?: InputMaybe<
    Array<Payments_User_Payment_Provider_Mappings_Select_Column>
  >;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<
    Array<Payments_User_Payment_Provider_Mappings_Order_By>
  >;
  where?: InputMaybe<Payments_User_Payment_Provider_Mappings_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersUser_Payment_Provider_Mappings_AggregateArgs = {
  distinct_on?: InputMaybe<
    Array<Payments_User_Payment_Provider_Mappings_Select_Column>
  >;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<
    Array<Payments_User_Payment_Provider_Mappings_Order_By>
  >;
  where?: InputMaybe<Payments_User_Payment_Provider_Mappings_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersVocabulary_CardsArgs = {
  distinct_on?: InputMaybe<Array<Vocabulary_Cards_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Vocabulary_Cards_Order_By>>;
  where?: InputMaybe<Vocabulary_Cards_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersVocabulary_Cards_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vocabulary_Cards_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Vocabulary_Cards_Order_By>>;
  where?: InputMaybe<Vocabulary_Cards_Bool_Exp>;
};

/** aggregated selection of "users" */
export type Users_Aggregate = {
  __typename?: "users_aggregate";
  aggregate?: Maybe<Users_Aggregate_Fields>;
  nodes: Array<Users>;
};

/** aggregate fields of "users" */
export type Users_Aggregate_Fields = {
  __typename?: "users_aggregate_fields";
  avg?: Maybe<Users_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Users_Max_Fields>;
  min?: Maybe<Users_Min_Fields>;
  stddev?: Maybe<Users_Stddev_Fields>;
  stddev_pop?: Maybe<Users_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Users_Stddev_Samp_Fields>;
  sum?: Maybe<Users_Sum_Fields>;
  var_pop?: Maybe<Users_Var_Pop_Fields>;
  var_samp?: Maybe<Users_Var_Samp_Fields>;
  variance?: Maybe<Users_Variance_Fields>;
};

/** aggregate fields of "users" */
export type Users_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Users_Avg_Fields = {
  __typename?: "users_avg_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  daily_goal_minutes?: Maybe<Scalars["Float"]["output"]>;
  /** Email verification timestamp */
  email_verified?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export type Users_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Bool_Exp>>;
  _not?: InputMaybe<Users_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Bool_Exp>>;
  accounts?: InputMaybe<Accounts_Bool_Exp>;
  accounts_aggregate?: InputMaybe<Accounts_Aggregate_Bool_Exp>;
  achievements?: InputMaybe<Achievements_Bool_Exp>;
  achievements_aggregate?: InputMaybe<Achievements_Aggregate_Bool_Exp>;
  ai_sessions?: InputMaybe<Ai_Sessions_Bool_Exp>;
  ai_sessions_aggregate?: InputMaybe<Ai_Sessions_Aggregate_Bool_Exp>;
  created_at?: InputMaybe<Bigint_Comparison_Exp>;
  current_level?: InputMaybe<String_Comparison_Exp>;
  daily_goal_minutes?: InputMaybe<Int_Comparison_Exp>;
  daily_tasks?: InputMaybe<Daily_Tasks_Bool_Exp>;
  daily_tasks_aggregate?: InputMaybe<Daily_Tasks_Aggregate_Bool_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  email_verified?: InputMaybe<Bigint_Comparison_Exp>;
  error_logs?: InputMaybe<Error_Log_Bool_Exp>;
  error_logs_aggregate?: InputMaybe<Error_Log_Aggregate_Bool_Exp>;
  exam_date?: InputMaybe<Date_Comparison_Exp>;
  hasura_role?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  image?: InputMaybe<String_Comparison_Exp>;
  is_admin?: InputMaybe<Boolean_Comparison_Exp>;
  methods?: InputMaybe<Payments_Methods_Bool_Exp>;
  methods_aggregate?: InputMaybe<Payments_Methods_Aggregate_Bool_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  notification_messages?: InputMaybe<Notification_Messages_Bool_Exp>;
  notification_messages_aggregate?: InputMaybe<Notification_Messages_Aggregate_Bool_Exp>;
  notification_permissions?: InputMaybe<Notification_Permissions_Bool_Exp>;
  notification_permissions_aggregate?: InputMaybe<Notification_Permissions_Aggregate_Bool_Exp>;
  operations?: InputMaybe<Payments_Operations_Bool_Exp>;
  operations_aggregate?: InputMaybe<Payments_Operations_Aggregate_Bool_Exp>;
  plans?: InputMaybe<Payments_Plans_Bool_Exp>;
  plans_aggregate?: InputMaybe<Payments_Plans_Aggregate_Bool_Exp>;
  progress_metrics?: InputMaybe<Progress_Metrics_Bool_Exp>;
  progress_metrics_aggregate?: InputMaybe<Progress_Metrics_Aggregate_Bool_Exp>;
  providers?: InputMaybe<Payments_Providers_Bool_Exp>;
  providers_aggregate?: InputMaybe<Payments_Providers_Aggregate_Bool_Exp>;
  reminder_enabled?: InputMaybe<Boolean_Comparison_Exp>;
  review_histories?: InputMaybe<Review_History_Bool_Exp>;
  review_histories_aggregate?: InputMaybe<Review_History_Aggregate_Bool_Exp>;
  stage_progresses?: InputMaybe<Stage_Progress_Bool_Exp>;
  stage_progresses_aggregate?: InputMaybe<Stage_Progress_Aggregate_Bool_Exp>;
  stage_tests?: InputMaybe<Stage_Tests_Bool_Exp>;
  stage_tests_aggregate?: InputMaybe<Stage_Tests_Aggregate_Bool_Exp>;
  start_date?: InputMaybe<Date_Comparison_Exp>;
  streak?: InputMaybe<Streaks_Bool_Exp>;
  study_place?: InputMaybe<String_Comparison_Exp>;
  study_time?: InputMaybe<Time_Comparison_Exp>;
  subscriptions?: InputMaybe<Payments_Subscriptions_Bool_Exp>;
  subscriptions_aggregate?: InputMaybe<Payments_Subscriptions_Aggregate_Bool_Exp>;
  target_level?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Bigint_Comparison_Exp>;
  user_payment_provider_mappings?: InputMaybe<Payments_User_Payment_Provider_Mappings_Bool_Exp>;
  user_payment_provider_mappings_aggregate?: InputMaybe<Payments_User_Payment_Provider_Mappings_Aggregate_Bool_Exp>;
  vocabulary_cards?: InputMaybe<Vocabulary_Cards_Bool_Exp>;
  vocabulary_cards_aggregate?: InputMaybe<Vocabulary_Cards_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "users" */
export enum Users_Constraint {
  /** unique or primary key constraint on columns "email" */
  UsersEmailKey = "users_email_key",
  /** unique or primary key constraint on columns "id" */
  UsersPkey = "users_pkey",
}

/** input type for incrementing numeric columns in table "users" */
export type Users_Inc_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  daily_goal_minutes?: InputMaybe<Scalars["Int"]["input"]>;
  /** Email verification timestamp */
  email_verified?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "users" */
export type Users_Insert_Input = {
  accounts?: InputMaybe<Accounts_Arr_Rel_Insert_Input>;
  achievements?: InputMaybe<Achievements_Arr_Rel_Insert_Input>;
  ai_sessions?: InputMaybe<Ai_Sessions_Arr_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  current_level?: InputMaybe<Scalars["String"]["input"]>;
  daily_goal_minutes?: InputMaybe<Scalars["Int"]["input"]>;
  daily_tasks?: InputMaybe<Daily_Tasks_Arr_Rel_Insert_Input>;
  /** User email address */
  email?: InputMaybe<Scalars["String"]["input"]>;
  /** Email verification timestamp */
  email_verified?: InputMaybe<Scalars["bigint"]["input"]>;
  error_logs?: InputMaybe<Error_Log_Arr_Rel_Insert_Input>;
  exam_date?: InputMaybe<Scalars["date"]["input"]>;
  /** Hasura role for permissions */
  hasura_role?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** User profile image URL */
  image?: InputMaybe<Scalars["String"]["input"]>;
  /** Admin flag */
  is_admin?: InputMaybe<Scalars["Boolean"]["input"]>;
  methods?: InputMaybe<Payments_Methods_Arr_Rel_Insert_Input>;
  /** User display name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  notification_messages?: InputMaybe<Notification_Messages_Arr_Rel_Insert_Input>;
  notification_permissions?: InputMaybe<Notification_Permissions_Arr_Rel_Insert_Input>;
  operations?: InputMaybe<Payments_Operations_Arr_Rel_Insert_Input>;
  plans?: InputMaybe<Payments_Plans_Arr_Rel_Insert_Input>;
  progress_metrics?: InputMaybe<Progress_Metrics_Arr_Rel_Insert_Input>;
  providers?: InputMaybe<Payments_Providers_Arr_Rel_Insert_Input>;
  reminder_enabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  review_histories?: InputMaybe<Review_History_Arr_Rel_Insert_Input>;
  stage_progresses?: InputMaybe<Stage_Progress_Arr_Rel_Insert_Input>;
  stage_tests?: InputMaybe<Stage_Tests_Arr_Rel_Insert_Input>;
  start_date?: InputMaybe<Scalars["date"]["input"]>;
  streak?: InputMaybe<Streaks_Obj_Rel_Insert_Input>;
  study_place?: InputMaybe<Scalars["String"]["input"]>;
  study_time?: InputMaybe<Scalars["time"]["input"]>;
  subscriptions?: InputMaybe<Payments_Subscriptions_Arr_Rel_Insert_Input>;
  target_level?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
  user_payment_provider_mappings?: InputMaybe<Payments_User_Payment_Provider_Mappings_Arr_Rel_Insert_Input>;
  vocabulary_cards?: InputMaybe<Vocabulary_Cards_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Users_Max_Fields = {
  __typename?: "users_max_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  current_level?: Maybe<Scalars["String"]["output"]>;
  daily_goal_minutes?: Maybe<Scalars["Int"]["output"]>;
  /** User email address */
  email?: Maybe<Scalars["String"]["output"]>;
  /** Email verification timestamp */
  email_verified?: Maybe<Scalars["bigint"]["output"]>;
  exam_date?: Maybe<Scalars["date"]["output"]>;
  /** Hasura role for permissions */
  hasura_role?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** User profile image URL */
  image?: Maybe<Scalars["String"]["output"]>;
  /** User display name */
  name?: Maybe<Scalars["String"]["output"]>;
  start_date?: Maybe<Scalars["date"]["output"]>;
  study_place?: Maybe<Scalars["String"]["output"]>;
  target_level?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** aggregate min on columns */
export type Users_Min_Fields = {
  __typename?: "users_min_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  current_level?: Maybe<Scalars["String"]["output"]>;
  daily_goal_minutes?: Maybe<Scalars["Int"]["output"]>;
  /** User email address */
  email?: Maybe<Scalars["String"]["output"]>;
  /** Email verification timestamp */
  email_verified?: Maybe<Scalars["bigint"]["output"]>;
  exam_date?: Maybe<Scalars["date"]["output"]>;
  /** Hasura role for permissions */
  hasura_role?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** User profile image URL */
  image?: Maybe<Scalars["String"]["output"]>;
  /** User display name */
  name?: Maybe<Scalars["String"]["output"]>;
  start_date?: Maybe<Scalars["date"]["output"]>;
  study_place?: Maybe<Scalars["String"]["output"]>;
  target_level?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** response of any mutation on the table "users" */
export type Users_Mutation_Response = {
  __typename?: "users_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Users>;
};

/** input type for inserting object relation for remote table "users" */
export type Users_Obj_Rel_Insert_Input = {
  data: Users_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** on_conflict condition type for table "users" */
export type Users_On_Conflict = {
  constraint: Users_Constraint;
  update_columns?: Array<Users_Update_Column>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** Ordering options when selecting data from "users". */
export type Users_Order_By = {
  accounts_aggregate?: InputMaybe<Accounts_Aggregate_Order_By>;
  achievements_aggregate?: InputMaybe<Achievements_Aggregate_Order_By>;
  ai_sessions_aggregate?: InputMaybe<Ai_Sessions_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  current_level?: InputMaybe<Order_By>;
  daily_goal_minutes?: InputMaybe<Order_By>;
  daily_tasks_aggregate?: InputMaybe<Daily_Tasks_Aggregate_Order_By>;
  email?: InputMaybe<Order_By>;
  email_verified?: InputMaybe<Order_By>;
  error_logs_aggregate?: InputMaybe<Error_Log_Aggregate_Order_By>;
  exam_date?: InputMaybe<Order_By>;
  hasura_role?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  image?: InputMaybe<Order_By>;
  is_admin?: InputMaybe<Order_By>;
  methods_aggregate?: InputMaybe<Payments_Methods_Aggregate_Order_By>;
  name?: InputMaybe<Order_By>;
  notification_messages_aggregate?: InputMaybe<Notification_Messages_Aggregate_Order_By>;
  notification_permissions_aggregate?: InputMaybe<Notification_Permissions_Aggregate_Order_By>;
  operations_aggregate?: InputMaybe<Payments_Operations_Aggregate_Order_By>;
  plans_aggregate?: InputMaybe<Payments_Plans_Aggregate_Order_By>;
  progress_metrics_aggregate?: InputMaybe<Progress_Metrics_Aggregate_Order_By>;
  providers_aggregate?: InputMaybe<Payments_Providers_Aggregate_Order_By>;
  reminder_enabled?: InputMaybe<Order_By>;
  review_histories_aggregate?: InputMaybe<Review_History_Aggregate_Order_By>;
  stage_progresses_aggregate?: InputMaybe<Stage_Progress_Aggregate_Order_By>;
  stage_tests_aggregate?: InputMaybe<Stage_Tests_Aggregate_Order_By>;
  start_date?: InputMaybe<Order_By>;
  streak?: InputMaybe<Streaks_Order_By>;
  study_place?: InputMaybe<Order_By>;
  study_time?: InputMaybe<Order_By>;
  subscriptions_aggregate?: InputMaybe<Payments_Subscriptions_Aggregate_Order_By>;
  target_level?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_payment_provider_mappings_aggregate?: InputMaybe<Payments_User_Payment_Provider_Mappings_Aggregate_Order_By>;
  vocabulary_cards_aggregate?: InputMaybe<Vocabulary_Cards_Aggregate_Order_By>;
};

/** primary key columns input for table: users */
export type Users_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "users" */
export enum Users_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  CurrentLevel = "current_level",
  /** column name */
  DailyGoalMinutes = "daily_goal_minutes",
  /** column name */
  Email = "email",
  /** column name */
  EmailVerified = "email_verified",
  /** column name */
  ExamDate = "exam_date",
  /** column name */
  HasuraRole = "hasura_role",
  /** column name */
  Id = "id",
  /** column name */
  Image = "image",
  /** column name */
  IsAdmin = "is_admin",
  /** column name */
  Name = "name",
  /** column name */
  ReminderEnabled = "reminder_enabled",
  /** column name */
  StartDate = "start_date",
  /** column name */
  StudyPlace = "study_place",
  /** column name */
  StudyTime = "study_time",
  /** column name */
  TargetLevel = "target_level",
  /** column name */
  UpdatedAt = "updated_at",
}

/** input type for updating data in table "users" */
export type Users_Set_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  current_level?: InputMaybe<Scalars["String"]["input"]>;
  daily_goal_minutes?: InputMaybe<Scalars["Int"]["input"]>;
  /** User email address */
  email?: InputMaybe<Scalars["String"]["input"]>;
  /** Email verification timestamp */
  email_verified?: InputMaybe<Scalars["bigint"]["input"]>;
  exam_date?: InputMaybe<Scalars["date"]["input"]>;
  /** Hasura role for permissions */
  hasura_role?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** User profile image URL */
  image?: InputMaybe<Scalars["String"]["input"]>;
  /** Admin flag */
  is_admin?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** User display name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  reminder_enabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  start_date?: InputMaybe<Scalars["date"]["input"]>;
  study_place?: InputMaybe<Scalars["String"]["input"]>;
  study_time?: InputMaybe<Scalars["time"]["input"]>;
  target_level?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate stddev on columns */
export type Users_Stddev_Fields = {
  __typename?: "users_stddev_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  daily_goal_minutes?: Maybe<Scalars["Float"]["output"]>;
  /** Email verification timestamp */
  email_verified?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Users_Stddev_Pop_Fields = {
  __typename?: "users_stddev_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  daily_goal_minutes?: Maybe<Scalars["Float"]["output"]>;
  /** Email verification timestamp */
  email_verified?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Users_Stddev_Samp_Fields = {
  __typename?: "users_stddev_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  daily_goal_minutes?: Maybe<Scalars["Float"]["output"]>;
  /** Email verification timestamp */
  email_verified?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "users" */
export type Users_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Users_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Users_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["bigint"]["input"]>;
  current_level?: InputMaybe<Scalars["String"]["input"]>;
  daily_goal_minutes?: InputMaybe<Scalars["Int"]["input"]>;
  /** User email address */
  email?: InputMaybe<Scalars["String"]["input"]>;
  /** Email verification timestamp */
  email_verified?: InputMaybe<Scalars["bigint"]["input"]>;
  exam_date?: InputMaybe<Scalars["date"]["input"]>;
  /** Hasura role for permissions */
  hasura_role?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** User profile image URL */
  image?: InputMaybe<Scalars["String"]["input"]>;
  /** Admin flag */
  is_admin?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** User display name */
  name?: InputMaybe<Scalars["String"]["input"]>;
  reminder_enabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  start_date?: InputMaybe<Scalars["date"]["input"]>;
  study_place?: InputMaybe<Scalars["String"]["input"]>;
  study_time?: InputMaybe<Scalars["time"]["input"]>;
  target_level?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** aggregate sum on columns */
export type Users_Sum_Fields = {
  __typename?: "users_sum_fields";
  created_at?: Maybe<Scalars["bigint"]["output"]>;
  daily_goal_minutes?: Maybe<Scalars["Int"]["output"]>;
  /** Email verification timestamp */
  email_verified?: Maybe<Scalars["bigint"]["output"]>;
  updated_at?: Maybe<Scalars["bigint"]["output"]>;
};

/** update columns of table "users" */
export enum Users_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  CurrentLevel = "current_level",
  /** column name */
  DailyGoalMinutes = "daily_goal_minutes",
  /** column name */
  Email = "email",
  /** column name */
  EmailVerified = "email_verified",
  /** column name */
  ExamDate = "exam_date",
  /** column name */
  HasuraRole = "hasura_role",
  /** column name */
  Id = "id",
  /** column name */
  Image = "image",
  /** column name */
  IsAdmin = "is_admin",
  /** column name */
  Name = "name",
  /** column name */
  ReminderEnabled = "reminder_enabled",
  /** column name */
  StartDate = "start_date",
  /** column name */
  StudyPlace = "study_place",
  /** column name */
  StudyTime = "study_time",
  /** column name */
  TargetLevel = "target_level",
  /** column name */
  UpdatedAt = "updated_at",
}

export type Users_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Users_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Users_Set_Input>;
  /** filter the rows which have to be updated */
  where: Users_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Users_Var_Pop_Fields = {
  __typename?: "users_var_pop_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  daily_goal_minutes?: Maybe<Scalars["Float"]["output"]>;
  /** Email verification timestamp */
  email_verified?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Users_Var_Samp_Fields = {
  __typename?: "users_var_samp_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  daily_goal_minutes?: Maybe<Scalars["Float"]["output"]>;
  /** Email verification timestamp */
  email_verified?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Users_Variance_Fields = {
  __typename?: "users_variance_fields";
  created_at?: Maybe<Scalars["Float"]["output"]>;
  daily_goal_minutes?: Maybe<Scalars["Float"]["output"]>;
  /** Email verification timestamp */
  email_verified?: Maybe<Scalars["Float"]["output"]>;
  updated_at?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["uuid"]["input"]>;
  _gt?: InputMaybe<Scalars["uuid"]["input"]>;
  _gte?: InputMaybe<Scalars["uuid"]["input"]>;
  _in?: InputMaybe<Array<Scalars["uuid"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["uuid"]["input"]>;
  _lte?: InputMaybe<Scalars["uuid"]["input"]>;
  _neq?: InputMaybe<Scalars["uuid"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["uuid"]["input"]>>;
};

/** columns and relationships of "verification_codes" */
export type Verification_Codes = {
  __typename?: "verification_codes";
  /** Number of verification attempts */
  attempts?: Maybe<Scalars["Int"]["output"]>;
  /** BCrypt hash of the verification code */
  code_hash: Scalars["String"]["output"];
  /** When the code was successfully used */
  consumed_at?: Maybe<Scalars["timestamptz"]["output"]>;
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  created_ms: Scalars["bigint"]["output"];
  /** Expiration timestamp of the code */
  expires_at: Scalars["timestamptz"]["output"];
  id: Scalars["uuid"]["output"];
  /** Email address or phone number being verified */
  identifier: Scalars["String"]["output"];
  /** Provider used for verification (email or phone) */
  provider: Scalars["String"]["output"];
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  updated_ms: Scalars["bigint"]["output"];
  /** Optional user who initiated verification (may differ from owner) */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregated selection of "verification_codes" */
export type Verification_Codes_Aggregate = {
  __typename?: "verification_codes_aggregate";
  aggregate?: Maybe<Verification_Codes_Aggregate_Fields>;
  nodes: Array<Verification_Codes>;
};

/** aggregate fields of "verification_codes" */
export type Verification_Codes_Aggregate_Fields = {
  __typename?: "verification_codes_aggregate_fields";
  avg?: Maybe<Verification_Codes_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Verification_Codes_Max_Fields>;
  min?: Maybe<Verification_Codes_Min_Fields>;
  stddev?: Maybe<Verification_Codes_Stddev_Fields>;
  stddev_pop?: Maybe<Verification_Codes_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Verification_Codes_Stddev_Samp_Fields>;
  sum?: Maybe<Verification_Codes_Sum_Fields>;
  var_pop?: Maybe<Verification_Codes_Var_Pop_Fields>;
  var_samp?: Maybe<Verification_Codes_Var_Samp_Fields>;
  variance?: Maybe<Verification_Codes_Variance_Fields>;
};

/** aggregate fields of "verification_codes" */
export type Verification_Codes_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Verification_Codes_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Verification_Codes_Avg_Fields = {
  __typename?: "verification_codes_avg_fields";
  /** Number of verification attempts */
  attempts?: Maybe<Scalars["Float"]["output"]>;
  created_ms?: Maybe<Scalars["Float"]["output"]>;
  updated_ms?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "verification_codes". All fields are combined with a logical 'AND'. */
export type Verification_Codes_Bool_Exp = {
  _and?: InputMaybe<Array<Verification_Codes_Bool_Exp>>;
  _not?: InputMaybe<Verification_Codes_Bool_Exp>;
  _or?: InputMaybe<Array<Verification_Codes_Bool_Exp>>;
  attempts?: InputMaybe<Int_Comparison_Exp>;
  code_hash?: InputMaybe<String_Comparison_Exp>;
  consumed_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_ms?: InputMaybe<Bigint_Comparison_Exp>;
  expires_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  identifier?: InputMaybe<String_Comparison_Exp>;
  provider?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_ms?: InputMaybe<Bigint_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "verification_codes" */
export enum Verification_Codes_Constraint {
  /** unique or primary key constraint on columns "id" */
  VerificationCodesPkey = "verification_codes_pkey",
}

/** input type for incrementing numeric columns in table "verification_codes" */
export type Verification_Codes_Inc_Input = {
  /** Number of verification attempts */
  attempts?: InputMaybe<Scalars["Int"]["input"]>;
  created_ms?: InputMaybe<Scalars["bigint"]["input"]>;
  updated_ms?: InputMaybe<Scalars["bigint"]["input"]>;
};

/** input type for inserting data into table "verification_codes" */
export type Verification_Codes_Insert_Input = {
  /** Number of verification attempts */
  attempts?: InputMaybe<Scalars["Int"]["input"]>;
  /** BCrypt hash of the verification code */
  code_hash?: InputMaybe<Scalars["String"]["input"]>;
  /** When the code was successfully used */
  consumed_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_ms?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Expiration timestamp of the code */
  expires_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Email address or phone number being verified */
  identifier?: InputMaybe<Scalars["String"]["input"]>;
  /** Provider used for verification (email or phone) */
  provider?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  updated_ms?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Optional user who initiated verification (may differ from owner) */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Verification_Codes_Max_Fields = {
  __typename?: "verification_codes_max_fields";
  /** Number of verification attempts */
  attempts?: Maybe<Scalars["Int"]["output"]>;
  /** BCrypt hash of the verification code */
  code_hash?: Maybe<Scalars["String"]["output"]>;
  /** When the code was successfully used */
  consumed_at?: Maybe<Scalars["timestamptz"]["output"]>;
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  created_ms?: Maybe<Scalars["bigint"]["output"]>;
  /** Expiration timestamp of the code */
  expires_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Email address or phone number being verified */
  identifier?: Maybe<Scalars["String"]["output"]>;
  /** Provider used for verification (email or phone) */
  provider?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  updated_ms?: Maybe<Scalars["bigint"]["output"]>;
  /** Optional user who initiated verification (may differ from owner) */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregate min on columns */
export type Verification_Codes_Min_Fields = {
  __typename?: "verification_codes_min_fields";
  /** Number of verification attempts */
  attempts?: Maybe<Scalars["Int"]["output"]>;
  /** BCrypt hash of the verification code */
  code_hash?: Maybe<Scalars["String"]["output"]>;
  /** When the code was successfully used */
  consumed_at?: Maybe<Scalars["timestamptz"]["output"]>;
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  created_ms?: Maybe<Scalars["bigint"]["output"]>;
  /** Expiration timestamp of the code */
  expires_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  /** Email address or phone number being verified */
  identifier?: Maybe<Scalars["String"]["output"]>;
  /** Provider used for verification (email or phone) */
  provider?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  updated_ms?: Maybe<Scalars["bigint"]["output"]>;
  /** Optional user who initiated verification (may differ from owner) */
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** response of any mutation on the table "verification_codes" */
export type Verification_Codes_Mutation_Response = {
  __typename?: "verification_codes_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Verification_Codes>;
};

/** on_conflict condition type for table "verification_codes" */
export type Verification_Codes_On_Conflict = {
  constraint: Verification_Codes_Constraint;
  update_columns?: Array<Verification_Codes_Update_Column>;
  where?: InputMaybe<Verification_Codes_Bool_Exp>;
};

/** Ordering options when selecting data from "verification_codes". */
export type Verification_Codes_Order_By = {
  attempts?: InputMaybe<Order_By>;
  code_hash?: InputMaybe<Order_By>;
  consumed_at?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  created_ms?: InputMaybe<Order_By>;
  expires_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  identifier?: InputMaybe<Order_By>;
  provider?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_ms?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: verification_codes */
export type Verification_Codes_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "verification_codes" */
export enum Verification_Codes_Select_Column {
  /** column name */
  Attempts = "attempts",
  /** column name */
  CodeHash = "code_hash",
  /** column name */
  ConsumedAt = "consumed_at",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  CreatedMs = "created_ms",
  /** column name */
  ExpiresAt = "expires_at",
  /** column name */
  Id = "id",
  /** column name */
  Identifier = "identifier",
  /** column name */
  Provider = "provider",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UpdatedMs = "updated_ms",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "verification_codes" */
export type Verification_Codes_Set_Input = {
  /** Number of verification attempts */
  attempts?: InputMaybe<Scalars["Int"]["input"]>;
  /** BCrypt hash of the verification code */
  code_hash?: InputMaybe<Scalars["String"]["input"]>;
  /** When the code was successfully used */
  consumed_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_ms?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Expiration timestamp of the code */
  expires_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Email address or phone number being verified */
  identifier?: InputMaybe<Scalars["String"]["input"]>;
  /** Provider used for verification (email or phone) */
  provider?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  updated_ms?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Optional user who initiated verification (may differ from owner) */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Verification_Codes_Stddev_Fields = {
  __typename?: "verification_codes_stddev_fields";
  /** Number of verification attempts */
  attempts?: Maybe<Scalars["Float"]["output"]>;
  created_ms?: Maybe<Scalars["Float"]["output"]>;
  updated_ms?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Verification_Codes_Stddev_Pop_Fields = {
  __typename?: "verification_codes_stddev_pop_fields";
  /** Number of verification attempts */
  attempts?: Maybe<Scalars["Float"]["output"]>;
  created_ms?: Maybe<Scalars["Float"]["output"]>;
  updated_ms?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Verification_Codes_Stddev_Samp_Fields = {
  __typename?: "verification_codes_stddev_samp_fields";
  /** Number of verification attempts */
  attempts?: Maybe<Scalars["Float"]["output"]>;
  created_ms?: Maybe<Scalars["Float"]["output"]>;
  updated_ms?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "verification_codes" */
export type Verification_Codes_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Verification_Codes_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Verification_Codes_Stream_Cursor_Value_Input = {
  /** Number of verification attempts */
  attempts?: InputMaybe<Scalars["Int"]["input"]>;
  /** BCrypt hash of the verification code */
  code_hash?: InputMaybe<Scalars["String"]["input"]>;
  /** When the code was successfully used */
  consumed_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  created_ms?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Expiration timestamp of the code */
  expires_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  /** Email address or phone number being verified */
  identifier?: InputMaybe<Scalars["String"]["input"]>;
  /** Provider used for verification (email or phone) */
  provider?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  updated_ms?: InputMaybe<Scalars["bigint"]["input"]>;
  /** Optional user who initiated verification (may differ from owner) */
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Verification_Codes_Sum_Fields = {
  __typename?: "verification_codes_sum_fields";
  /** Number of verification attempts */
  attempts?: Maybe<Scalars["Int"]["output"]>;
  created_ms?: Maybe<Scalars["bigint"]["output"]>;
  updated_ms?: Maybe<Scalars["bigint"]["output"]>;
};

/** update columns of table "verification_codes" */
export enum Verification_Codes_Update_Column {
  /** column name */
  Attempts = "attempts",
  /** column name */
  CodeHash = "code_hash",
  /** column name */
  ConsumedAt = "consumed_at",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  CreatedMs = "created_ms",
  /** column name */
  ExpiresAt = "expires_at",
  /** column name */
  Id = "id",
  /** column name */
  Identifier = "identifier",
  /** column name */
  Provider = "provider",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UpdatedMs = "updated_ms",
  /** column name */
  UserId = "user_id",
}

export type Verification_Codes_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Verification_Codes_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Verification_Codes_Set_Input>;
  /** filter the rows which have to be updated */
  where: Verification_Codes_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Verification_Codes_Var_Pop_Fields = {
  __typename?: "verification_codes_var_pop_fields";
  /** Number of verification attempts */
  attempts?: Maybe<Scalars["Float"]["output"]>;
  created_ms?: Maybe<Scalars["Float"]["output"]>;
  updated_ms?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Verification_Codes_Var_Samp_Fields = {
  __typename?: "verification_codes_var_samp_fields";
  /** Number of verification attempts */
  attempts?: Maybe<Scalars["Float"]["output"]>;
  created_ms?: Maybe<Scalars["Float"]["output"]>;
  updated_ms?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Verification_Codes_Variance_Fields = {
  __typename?: "verification_codes_variance_fields";
  /** Number of verification attempts */
  attempts?: Maybe<Scalars["Float"]["output"]>;
  created_ms?: Maybe<Scalars["Float"]["output"]>;
  updated_ms?: Maybe<Scalars["Float"]["output"]>;
};

/** columns and relationships of "storage.virus" */
export type Virus = {
  __typename?: "virus";
  createdAt: Scalars["timestamptz"]["output"];
  /** An object relationship */
  file: Files;
  fileId: Scalars["uuid"]["output"];
  filename: Scalars["String"]["output"];
  id: Scalars["uuid"]["output"];
  updatedAt: Scalars["timestamptz"]["output"];
  userSession: Scalars["jsonb"]["output"];
  virus: Scalars["String"]["output"];
};

/** columns and relationships of "storage.virus" */
export type VirusUserSessionArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "storage.virus" */
export type Virus_Aggregate = {
  __typename?: "virus_aggregate";
  aggregate?: Maybe<Virus_Aggregate_Fields>;
  nodes: Array<Virus>;
};

/** aggregate fields of "storage.virus" */
export type Virus_Aggregate_Fields = {
  __typename?: "virus_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Virus_Max_Fields>;
  min?: Maybe<Virus_Min_Fields>;
};

/** aggregate fields of "storage.virus" */
export type Virus_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Virus_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Virus_Append_Input = {
  userSession?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** Boolean expression to filter rows from the table "storage.virus". All fields are combined with a logical 'AND'. */
export type Virus_Bool_Exp = {
  _and?: InputMaybe<Array<Virus_Bool_Exp>>;
  _not?: InputMaybe<Virus_Bool_Exp>;
  _or?: InputMaybe<Array<Virus_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  file?: InputMaybe<Files_Bool_Exp>;
  fileId?: InputMaybe<Uuid_Comparison_Exp>;
  filename?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  userSession?: InputMaybe<Jsonb_Comparison_Exp>;
  virus?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "storage.virus" */
export enum Virus_Constraint {
  /** unique or primary key constraint on columns "id" */
  VirusPkey = "virus_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Virus_Delete_At_Path_Input = {
  userSession?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Virus_Delete_Elem_Input = {
  userSession?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Virus_Delete_Key_Input = {
  userSession?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for inserting data into table "storage.virus" */
export type Virus_Insert_Input = {
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  file?: InputMaybe<Files_Obj_Rel_Insert_Input>;
  fileId?: InputMaybe<Scalars["uuid"]["input"]>;
  filename?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  userSession?: InputMaybe<Scalars["jsonb"]["input"]>;
  virus?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type Virus_Max_Fields = {
  __typename?: "virus_max_fields";
  createdAt?: Maybe<Scalars["timestamptz"]["output"]>;
  fileId?: Maybe<Scalars["uuid"]["output"]>;
  filename?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updatedAt?: Maybe<Scalars["timestamptz"]["output"]>;
  virus?: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type Virus_Min_Fields = {
  __typename?: "virus_min_fields";
  createdAt?: Maybe<Scalars["timestamptz"]["output"]>;
  fileId?: Maybe<Scalars["uuid"]["output"]>;
  filename?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updatedAt?: Maybe<Scalars["timestamptz"]["output"]>;
  virus?: Maybe<Scalars["String"]["output"]>;
};

/** response of any mutation on the table "storage.virus" */
export type Virus_Mutation_Response = {
  __typename?: "virus_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Virus>;
};

/** on_conflict condition type for table "storage.virus" */
export type Virus_On_Conflict = {
  constraint: Virus_Constraint;
  update_columns?: Array<Virus_Update_Column>;
  where?: InputMaybe<Virus_Bool_Exp>;
};

/** Ordering options when selecting data from "storage.virus". */
export type Virus_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  file?: InputMaybe<Files_Order_By>;
  fileId?: InputMaybe<Order_By>;
  filename?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  userSession?: InputMaybe<Order_By>;
  virus?: InputMaybe<Order_By>;
};

/** primary key columns input for table: storage.virus */
export type Virus_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Virus_Prepend_Input = {
  userSession?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "storage.virus" */
export enum Virus_Select_Column {
  /** column name */
  CreatedAt = "createdAt",
  /** column name */
  FileId = "fileId",
  /** column name */
  Filename = "filename",
  /** column name */
  Id = "id",
  /** column name */
  UpdatedAt = "updatedAt",
  /** column name */
  UserSession = "userSession",
  /** column name */
  Virus = "virus",
}

/** input type for updating data in table "storage.virus" */
export type Virus_Set_Input = {
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  fileId?: InputMaybe<Scalars["uuid"]["input"]>;
  filename?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  userSession?: InputMaybe<Scalars["jsonb"]["input"]>;
  virus?: InputMaybe<Scalars["String"]["input"]>;
};

/** Streaming cursor of the table "virus" */
export type Virus_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Virus_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Virus_Stream_Cursor_Value_Input = {
  createdAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  fileId?: InputMaybe<Scalars["uuid"]["input"]>;
  filename?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updatedAt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  userSession?: InputMaybe<Scalars["jsonb"]["input"]>;
  virus?: InputMaybe<Scalars["String"]["input"]>;
};

/** update columns of table "storage.virus" */
export enum Virus_Update_Column {
  /** column name */
  CreatedAt = "createdAt",
  /** column name */
  FileId = "fileId",
  /** column name */
  Filename = "filename",
  /** column name */
  Id = "id",
  /** column name */
  UpdatedAt = "updatedAt",
  /** column name */
  UserSession = "userSession",
  /** column name */
  Virus = "virus",
}

export type Virus_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Virus_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Virus_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Virus_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Virus_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Virus_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Virus_Set_Input>;
  /** filter the rows which have to be updated */
  where: Virus_Bool_Exp;
};

/** columns and relationships of "vocabulary_cards" */
export type Vocabulary_Cards = {
  __typename?: "vocabulary_cards";
  added_date?: Maybe<Scalars["date"]["output"]>;
  correct_count?: Maybe<Scalars["Int"]["output"]>;
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  difficulty?: Maybe<Scalars["String"]["output"]>;
  example_sentence?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["uuid"]["output"];
  incorrect_count?: Maybe<Scalars["Int"]["output"]>;
  last_reviewed_at?: Maybe<Scalars["timestamp"]["output"]>;
  next_review_date: Scalars["date"]["output"];
  part_of_speech?: Maybe<Scalars["String"]["output"]>;
  /** An array relationship */
  review_histories: Array<Review_History>;
  /** An aggregate relationship */
  review_histories_aggregate: Review_History_Aggregate;
  topic?: Maybe<Scalars["String"]["output"]>;
  translation: Scalars["String"]["output"];
  /** An object relationship */
  user?: Maybe<Users>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
  word: Scalars["String"]["output"];
};

/** columns and relationships of "vocabulary_cards" */
export type Vocabulary_CardsReview_HistoriesArgs = {
  distinct_on?: InputMaybe<Array<Review_History_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Review_History_Order_By>>;
  where?: InputMaybe<Review_History_Bool_Exp>;
};

/** columns and relationships of "vocabulary_cards" */
export type Vocabulary_CardsReview_Histories_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Review_History_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Review_History_Order_By>>;
  where?: InputMaybe<Review_History_Bool_Exp>;
};

/** aggregated selection of "vocabulary_cards" */
export type Vocabulary_Cards_Aggregate = {
  __typename?: "vocabulary_cards_aggregate";
  aggregate?: Maybe<Vocabulary_Cards_Aggregate_Fields>;
  nodes: Array<Vocabulary_Cards>;
};

export type Vocabulary_Cards_Aggregate_Bool_Exp = {
  count?: InputMaybe<Vocabulary_Cards_Aggregate_Bool_Exp_Count>;
};

export type Vocabulary_Cards_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Vocabulary_Cards_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Vocabulary_Cards_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "vocabulary_cards" */
export type Vocabulary_Cards_Aggregate_Fields = {
  __typename?: "vocabulary_cards_aggregate_fields";
  avg?: Maybe<Vocabulary_Cards_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Vocabulary_Cards_Max_Fields>;
  min?: Maybe<Vocabulary_Cards_Min_Fields>;
  stddev?: Maybe<Vocabulary_Cards_Stddev_Fields>;
  stddev_pop?: Maybe<Vocabulary_Cards_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Vocabulary_Cards_Stddev_Samp_Fields>;
  sum?: Maybe<Vocabulary_Cards_Sum_Fields>;
  var_pop?: Maybe<Vocabulary_Cards_Var_Pop_Fields>;
  var_samp?: Maybe<Vocabulary_Cards_Var_Samp_Fields>;
  variance?: Maybe<Vocabulary_Cards_Variance_Fields>;
};

/** aggregate fields of "vocabulary_cards" */
export type Vocabulary_Cards_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Vocabulary_Cards_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "vocabulary_cards" */
export type Vocabulary_Cards_Aggregate_Order_By = {
  avg?: InputMaybe<Vocabulary_Cards_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Vocabulary_Cards_Max_Order_By>;
  min?: InputMaybe<Vocabulary_Cards_Min_Order_By>;
  stddev?: InputMaybe<Vocabulary_Cards_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Vocabulary_Cards_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Vocabulary_Cards_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Vocabulary_Cards_Sum_Order_By>;
  var_pop?: InputMaybe<Vocabulary_Cards_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Vocabulary_Cards_Var_Samp_Order_By>;
  variance?: InputMaybe<Vocabulary_Cards_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "vocabulary_cards" */
export type Vocabulary_Cards_Arr_Rel_Insert_Input = {
  data: Array<Vocabulary_Cards_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Vocabulary_Cards_On_Conflict>;
};

/** aggregate avg on columns */
export type Vocabulary_Cards_Avg_Fields = {
  __typename?: "vocabulary_cards_avg_fields";
  correct_count?: Maybe<Scalars["Float"]["output"]>;
  incorrect_count?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "vocabulary_cards" */
export type Vocabulary_Cards_Avg_Order_By = {
  correct_count?: InputMaybe<Order_By>;
  incorrect_count?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "vocabulary_cards". All fields are combined with a logical 'AND'. */
export type Vocabulary_Cards_Bool_Exp = {
  _and?: InputMaybe<Array<Vocabulary_Cards_Bool_Exp>>;
  _not?: InputMaybe<Vocabulary_Cards_Bool_Exp>;
  _or?: InputMaybe<Array<Vocabulary_Cards_Bool_Exp>>;
  added_date?: InputMaybe<Date_Comparison_Exp>;
  correct_count?: InputMaybe<Int_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  difficulty?: InputMaybe<String_Comparison_Exp>;
  example_sentence?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  incorrect_count?: InputMaybe<Int_Comparison_Exp>;
  last_reviewed_at?: InputMaybe<Timestamp_Comparison_Exp>;
  next_review_date?: InputMaybe<Date_Comparison_Exp>;
  part_of_speech?: InputMaybe<String_Comparison_Exp>;
  review_histories?: InputMaybe<Review_History_Bool_Exp>;
  review_histories_aggregate?: InputMaybe<Review_History_Aggregate_Bool_Exp>;
  topic?: InputMaybe<String_Comparison_Exp>;
  translation?: InputMaybe<String_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
  word?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "vocabulary_cards" */
export enum Vocabulary_Cards_Constraint {
  /** unique or primary key constraint on columns "id" */
  VocabularyCardsPkey = "vocabulary_cards_pkey",
}

/** input type for incrementing numeric columns in table "vocabulary_cards" */
export type Vocabulary_Cards_Inc_Input = {
  correct_count?: InputMaybe<Scalars["Int"]["input"]>;
  incorrect_count?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "vocabulary_cards" */
export type Vocabulary_Cards_Insert_Input = {
  added_date?: InputMaybe<Scalars["date"]["input"]>;
  correct_count?: InputMaybe<Scalars["Int"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  difficulty?: InputMaybe<Scalars["String"]["input"]>;
  example_sentence?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  incorrect_count?: InputMaybe<Scalars["Int"]["input"]>;
  last_reviewed_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  next_review_date?: InputMaybe<Scalars["date"]["input"]>;
  part_of_speech?: InputMaybe<Scalars["String"]["input"]>;
  review_histories?: InputMaybe<Review_History_Arr_Rel_Insert_Input>;
  topic?: InputMaybe<Scalars["String"]["input"]>;
  translation?: InputMaybe<Scalars["String"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  word?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type Vocabulary_Cards_Max_Fields = {
  __typename?: "vocabulary_cards_max_fields";
  added_date?: Maybe<Scalars["date"]["output"]>;
  correct_count?: Maybe<Scalars["Int"]["output"]>;
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  difficulty?: Maybe<Scalars["String"]["output"]>;
  example_sentence?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  incorrect_count?: Maybe<Scalars["Int"]["output"]>;
  last_reviewed_at?: Maybe<Scalars["timestamp"]["output"]>;
  next_review_date?: Maybe<Scalars["date"]["output"]>;
  part_of_speech?: Maybe<Scalars["String"]["output"]>;
  topic?: Maybe<Scalars["String"]["output"]>;
  translation?: Maybe<Scalars["String"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
  word?: Maybe<Scalars["String"]["output"]>;
};

/** order by max() on columns of table "vocabulary_cards" */
export type Vocabulary_Cards_Max_Order_By = {
  added_date?: InputMaybe<Order_By>;
  correct_count?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  difficulty?: InputMaybe<Order_By>;
  example_sentence?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  incorrect_count?: InputMaybe<Order_By>;
  last_reviewed_at?: InputMaybe<Order_By>;
  next_review_date?: InputMaybe<Order_By>;
  part_of_speech?: InputMaybe<Order_By>;
  topic?: InputMaybe<Order_By>;
  translation?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
  word?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Vocabulary_Cards_Min_Fields = {
  __typename?: "vocabulary_cards_min_fields";
  added_date?: Maybe<Scalars["date"]["output"]>;
  correct_count?: Maybe<Scalars["Int"]["output"]>;
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  difficulty?: Maybe<Scalars["String"]["output"]>;
  example_sentence?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  incorrect_count?: Maybe<Scalars["Int"]["output"]>;
  last_reviewed_at?: Maybe<Scalars["timestamp"]["output"]>;
  next_review_date?: Maybe<Scalars["date"]["output"]>;
  part_of_speech?: Maybe<Scalars["String"]["output"]>;
  topic?: Maybe<Scalars["String"]["output"]>;
  translation?: Maybe<Scalars["String"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
  word?: Maybe<Scalars["String"]["output"]>;
};

/** order by min() on columns of table "vocabulary_cards" */
export type Vocabulary_Cards_Min_Order_By = {
  added_date?: InputMaybe<Order_By>;
  correct_count?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  difficulty?: InputMaybe<Order_By>;
  example_sentence?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  incorrect_count?: InputMaybe<Order_By>;
  last_reviewed_at?: InputMaybe<Order_By>;
  next_review_date?: InputMaybe<Order_By>;
  part_of_speech?: InputMaybe<Order_By>;
  topic?: InputMaybe<Order_By>;
  translation?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
  word?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "vocabulary_cards" */
export type Vocabulary_Cards_Mutation_Response = {
  __typename?: "vocabulary_cards_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Vocabulary_Cards>;
};

/** input type for inserting object relation for remote table "vocabulary_cards" */
export type Vocabulary_Cards_Obj_Rel_Insert_Input = {
  data: Vocabulary_Cards_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Vocabulary_Cards_On_Conflict>;
};

/** on_conflict condition type for table "vocabulary_cards" */
export type Vocabulary_Cards_On_Conflict = {
  constraint: Vocabulary_Cards_Constraint;
  update_columns?: Array<Vocabulary_Cards_Update_Column>;
  where?: InputMaybe<Vocabulary_Cards_Bool_Exp>;
};

/** Ordering options when selecting data from "vocabulary_cards". */
export type Vocabulary_Cards_Order_By = {
  added_date?: InputMaybe<Order_By>;
  correct_count?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  difficulty?: InputMaybe<Order_By>;
  example_sentence?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  incorrect_count?: InputMaybe<Order_By>;
  last_reviewed_at?: InputMaybe<Order_By>;
  next_review_date?: InputMaybe<Order_By>;
  part_of_speech?: InputMaybe<Order_By>;
  review_histories_aggregate?: InputMaybe<Review_History_Aggregate_Order_By>;
  topic?: InputMaybe<Order_By>;
  translation?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
  word?: InputMaybe<Order_By>;
};

/** primary key columns input for table: vocabulary_cards */
export type Vocabulary_Cards_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "vocabulary_cards" */
export enum Vocabulary_Cards_Select_Column {
  /** column name */
  AddedDate = "added_date",
  /** column name */
  CorrectCount = "correct_count",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Difficulty = "difficulty",
  /** column name */
  ExampleSentence = "example_sentence",
  /** column name */
  Id = "id",
  /** column name */
  IncorrectCount = "incorrect_count",
  /** column name */
  LastReviewedAt = "last_reviewed_at",
  /** column name */
  NextReviewDate = "next_review_date",
  /** column name */
  PartOfSpeech = "part_of_speech",
  /** column name */
  Topic = "topic",
  /** column name */
  Translation = "translation",
  /** column name */
  UserId = "user_id",
  /** column name */
  Word = "word",
}

/** input type for updating data in table "vocabulary_cards" */
export type Vocabulary_Cards_Set_Input = {
  added_date?: InputMaybe<Scalars["date"]["input"]>;
  correct_count?: InputMaybe<Scalars["Int"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  difficulty?: InputMaybe<Scalars["String"]["input"]>;
  example_sentence?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  incorrect_count?: InputMaybe<Scalars["Int"]["input"]>;
  last_reviewed_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  next_review_date?: InputMaybe<Scalars["date"]["input"]>;
  part_of_speech?: InputMaybe<Scalars["String"]["input"]>;
  topic?: InputMaybe<Scalars["String"]["input"]>;
  translation?: InputMaybe<Scalars["String"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  word?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate stddev on columns */
export type Vocabulary_Cards_Stddev_Fields = {
  __typename?: "vocabulary_cards_stddev_fields";
  correct_count?: Maybe<Scalars["Float"]["output"]>;
  incorrect_count?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "vocabulary_cards" */
export type Vocabulary_Cards_Stddev_Order_By = {
  correct_count?: InputMaybe<Order_By>;
  incorrect_count?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Vocabulary_Cards_Stddev_Pop_Fields = {
  __typename?: "vocabulary_cards_stddev_pop_fields";
  correct_count?: Maybe<Scalars["Float"]["output"]>;
  incorrect_count?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "vocabulary_cards" */
export type Vocabulary_Cards_Stddev_Pop_Order_By = {
  correct_count?: InputMaybe<Order_By>;
  incorrect_count?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Vocabulary_Cards_Stddev_Samp_Fields = {
  __typename?: "vocabulary_cards_stddev_samp_fields";
  correct_count?: Maybe<Scalars["Float"]["output"]>;
  incorrect_count?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "vocabulary_cards" */
export type Vocabulary_Cards_Stddev_Samp_Order_By = {
  correct_count?: InputMaybe<Order_By>;
  incorrect_count?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "vocabulary_cards" */
export type Vocabulary_Cards_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Vocabulary_Cards_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Vocabulary_Cards_Stream_Cursor_Value_Input = {
  added_date?: InputMaybe<Scalars["date"]["input"]>;
  correct_count?: InputMaybe<Scalars["Int"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  difficulty?: InputMaybe<Scalars["String"]["input"]>;
  example_sentence?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  incorrect_count?: InputMaybe<Scalars["Int"]["input"]>;
  last_reviewed_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  next_review_date?: InputMaybe<Scalars["date"]["input"]>;
  part_of_speech?: InputMaybe<Scalars["String"]["input"]>;
  topic?: InputMaybe<Scalars["String"]["input"]>;
  translation?: InputMaybe<Scalars["String"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  word?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate sum on columns */
export type Vocabulary_Cards_Sum_Fields = {
  __typename?: "vocabulary_cards_sum_fields";
  correct_count?: Maybe<Scalars["Int"]["output"]>;
  incorrect_count?: Maybe<Scalars["Int"]["output"]>;
};

/** order by sum() on columns of table "vocabulary_cards" */
export type Vocabulary_Cards_Sum_Order_By = {
  correct_count?: InputMaybe<Order_By>;
  incorrect_count?: InputMaybe<Order_By>;
};

/** update columns of table "vocabulary_cards" */
export enum Vocabulary_Cards_Update_Column {
  /** column name */
  AddedDate = "added_date",
  /** column name */
  CorrectCount = "correct_count",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Difficulty = "difficulty",
  /** column name */
  ExampleSentence = "example_sentence",
  /** column name */
  Id = "id",
  /** column name */
  IncorrectCount = "incorrect_count",
  /** column name */
  LastReviewedAt = "last_reviewed_at",
  /** column name */
  NextReviewDate = "next_review_date",
  /** column name */
  PartOfSpeech = "part_of_speech",
  /** column name */
  Topic = "topic",
  /** column name */
  Translation = "translation",
  /** column name */
  UserId = "user_id",
  /** column name */
  Word = "word",
}

export type Vocabulary_Cards_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Vocabulary_Cards_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Vocabulary_Cards_Set_Input>;
  /** filter the rows which have to be updated */
  where: Vocabulary_Cards_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Vocabulary_Cards_Var_Pop_Fields = {
  __typename?: "vocabulary_cards_var_pop_fields";
  correct_count?: Maybe<Scalars["Float"]["output"]>;
  incorrect_count?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "vocabulary_cards" */
export type Vocabulary_Cards_Var_Pop_Order_By = {
  correct_count?: InputMaybe<Order_By>;
  incorrect_count?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Vocabulary_Cards_Var_Samp_Fields = {
  __typename?: "vocabulary_cards_var_samp_fields";
  correct_count?: Maybe<Scalars["Float"]["output"]>;
  incorrect_count?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "vocabulary_cards" */
export type Vocabulary_Cards_Var_Samp_Order_By = {
  correct_count?: InputMaybe<Order_By>;
  incorrect_count?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Vocabulary_Cards_Variance_Fields = {
  __typename?: "vocabulary_cards_variance_fields";
  correct_count?: Maybe<Scalars["Float"]["output"]>;
  incorrect_count?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "vocabulary_cards" */
export type Vocabulary_Cards_Variance_Order_By = {
  correct_count?: InputMaybe<Order_By>;
  incorrect_count?: InputMaybe<Order_By>;
};

/** columns and relationships of "weekly_structure" */
export type Weekly_Structure = {
  __typename?: "weekly_structure";
  activity_type: Scalars["String"]["output"];
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  day_of_week: Scalars["Int"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  duration_minutes: Scalars["Int"]["output"];
  id: Scalars["uuid"]["output"];
  order_index: Scalars["Int"]["output"];
  stage_id?: Maybe<Scalars["uuid"]["output"]>;
  /** An object relationship */
  study_stage?: Maybe<Study_Stages>;
};

/** aggregated selection of "weekly_structure" */
export type Weekly_Structure_Aggregate = {
  __typename?: "weekly_structure_aggregate";
  aggregate?: Maybe<Weekly_Structure_Aggregate_Fields>;
  nodes: Array<Weekly_Structure>;
};

export type Weekly_Structure_Aggregate_Bool_Exp = {
  count?: InputMaybe<Weekly_Structure_Aggregate_Bool_Exp_Count>;
};

export type Weekly_Structure_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Weekly_Structure_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Weekly_Structure_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "weekly_structure" */
export type Weekly_Structure_Aggregate_Fields = {
  __typename?: "weekly_structure_aggregate_fields";
  avg?: Maybe<Weekly_Structure_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Weekly_Structure_Max_Fields>;
  min?: Maybe<Weekly_Structure_Min_Fields>;
  stddev?: Maybe<Weekly_Structure_Stddev_Fields>;
  stddev_pop?: Maybe<Weekly_Structure_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Weekly_Structure_Stddev_Samp_Fields>;
  sum?: Maybe<Weekly_Structure_Sum_Fields>;
  var_pop?: Maybe<Weekly_Structure_Var_Pop_Fields>;
  var_samp?: Maybe<Weekly_Structure_Var_Samp_Fields>;
  variance?: Maybe<Weekly_Structure_Variance_Fields>;
};

/** aggregate fields of "weekly_structure" */
export type Weekly_Structure_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Weekly_Structure_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "weekly_structure" */
export type Weekly_Structure_Aggregate_Order_By = {
  avg?: InputMaybe<Weekly_Structure_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Weekly_Structure_Max_Order_By>;
  min?: InputMaybe<Weekly_Structure_Min_Order_By>;
  stddev?: InputMaybe<Weekly_Structure_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Weekly_Structure_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Weekly_Structure_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Weekly_Structure_Sum_Order_By>;
  var_pop?: InputMaybe<Weekly_Structure_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Weekly_Structure_Var_Samp_Order_By>;
  variance?: InputMaybe<Weekly_Structure_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "weekly_structure" */
export type Weekly_Structure_Arr_Rel_Insert_Input = {
  data: Array<Weekly_Structure_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Weekly_Structure_On_Conflict>;
};

/** aggregate avg on columns */
export type Weekly_Structure_Avg_Fields = {
  __typename?: "weekly_structure_avg_fields";
  day_of_week?: Maybe<Scalars["Float"]["output"]>;
  duration_minutes?: Maybe<Scalars["Float"]["output"]>;
  order_index?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "weekly_structure" */
export type Weekly_Structure_Avg_Order_By = {
  day_of_week?: InputMaybe<Order_By>;
  duration_minutes?: InputMaybe<Order_By>;
  order_index?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "weekly_structure". All fields are combined with a logical 'AND'. */
export type Weekly_Structure_Bool_Exp = {
  _and?: InputMaybe<Array<Weekly_Structure_Bool_Exp>>;
  _not?: InputMaybe<Weekly_Structure_Bool_Exp>;
  _or?: InputMaybe<Array<Weekly_Structure_Bool_Exp>>;
  activity_type?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  day_of_week?: InputMaybe<Int_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  duration_minutes?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  order_index?: InputMaybe<Int_Comparison_Exp>;
  stage_id?: InputMaybe<Uuid_Comparison_Exp>;
  study_stage?: InputMaybe<Study_Stages_Bool_Exp>;
};

/** unique or primary key constraints on table "weekly_structure" */
export enum Weekly_Structure_Constraint {
  /** unique or primary key constraint on columns "id" */
  WeeklyStructurePkey = "weekly_structure_pkey",
}

/** input type for incrementing numeric columns in table "weekly_structure" */
export type Weekly_Structure_Inc_Input = {
  day_of_week?: InputMaybe<Scalars["Int"]["input"]>;
  duration_minutes?: InputMaybe<Scalars["Int"]["input"]>;
  order_index?: InputMaybe<Scalars["Int"]["input"]>;
};

/** input type for inserting data into table "weekly_structure" */
export type Weekly_Structure_Insert_Input = {
  activity_type?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  day_of_week?: InputMaybe<Scalars["Int"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  duration_minutes?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  order_index?: InputMaybe<Scalars["Int"]["input"]>;
  stage_id?: InputMaybe<Scalars["uuid"]["input"]>;
  study_stage?: InputMaybe<Study_Stages_Obj_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Weekly_Structure_Max_Fields = {
  __typename?: "weekly_structure_max_fields";
  activity_type?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  day_of_week?: Maybe<Scalars["Int"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  duration_minutes?: Maybe<Scalars["Int"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  order_index?: Maybe<Scalars["Int"]["output"]>;
  stage_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "weekly_structure" */
export type Weekly_Structure_Max_Order_By = {
  activity_type?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  day_of_week?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  duration_minutes?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_index?: InputMaybe<Order_By>;
  stage_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Weekly_Structure_Min_Fields = {
  __typename?: "weekly_structure_min_fields";
  activity_type?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["timestamp"]["output"]>;
  day_of_week?: Maybe<Scalars["Int"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  duration_minutes?: Maybe<Scalars["Int"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  order_index?: Maybe<Scalars["Int"]["output"]>;
  stage_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "weekly_structure" */
export type Weekly_Structure_Min_Order_By = {
  activity_type?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  day_of_week?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  duration_minutes?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_index?: InputMaybe<Order_By>;
  stage_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "weekly_structure" */
export type Weekly_Structure_Mutation_Response = {
  __typename?: "weekly_structure_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Weekly_Structure>;
};

/** on_conflict condition type for table "weekly_structure" */
export type Weekly_Structure_On_Conflict = {
  constraint: Weekly_Structure_Constraint;
  update_columns?: Array<Weekly_Structure_Update_Column>;
  where?: InputMaybe<Weekly_Structure_Bool_Exp>;
};

/** Ordering options when selecting data from "weekly_structure". */
export type Weekly_Structure_Order_By = {
  activity_type?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  day_of_week?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  duration_minutes?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  order_index?: InputMaybe<Order_By>;
  stage_id?: InputMaybe<Order_By>;
  study_stage?: InputMaybe<Study_Stages_Order_By>;
};

/** primary key columns input for table: weekly_structure */
export type Weekly_Structure_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "weekly_structure" */
export enum Weekly_Structure_Select_Column {
  /** column name */
  ActivityType = "activity_type",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DayOfWeek = "day_of_week",
  /** column name */
  Description = "description",
  /** column name */
  DurationMinutes = "duration_minutes",
  /** column name */
  Id = "id",
  /** column name */
  OrderIndex = "order_index",
  /** column name */
  StageId = "stage_id",
}

/** input type for updating data in table "weekly_structure" */
export type Weekly_Structure_Set_Input = {
  activity_type?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  day_of_week?: InputMaybe<Scalars["Int"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  duration_minutes?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  order_index?: InputMaybe<Scalars["Int"]["input"]>;
  stage_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Weekly_Structure_Stddev_Fields = {
  __typename?: "weekly_structure_stddev_fields";
  day_of_week?: Maybe<Scalars["Float"]["output"]>;
  duration_minutes?: Maybe<Scalars["Float"]["output"]>;
  order_index?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "weekly_structure" */
export type Weekly_Structure_Stddev_Order_By = {
  day_of_week?: InputMaybe<Order_By>;
  duration_minutes?: InputMaybe<Order_By>;
  order_index?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Weekly_Structure_Stddev_Pop_Fields = {
  __typename?: "weekly_structure_stddev_pop_fields";
  day_of_week?: Maybe<Scalars["Float"]["output"]>;
  duration_minutes?: Maybe<Scalars["Float"]["output"]>;
  order_index?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "weekly_structure" */
export type Weekly_Structure_Stddev_Pop_Order_By = {
  day_of_week?: InputMaybe<Order_By>;
  duration_minutes?: InputMaybe<Order_By>;
  order_index?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Weekly_Structure_Stddev_Samp_Fields = {
  __typename?: "weekly_structure_stddev_samp_fields";
  day_of_week?: Maybe<Scalars["Float"]["output"]>;
  duration_minutes?: Maybe<Scalars["Float"]["output"]>;
  order_index?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "weekly_structure" */
export type Weekly_Structure_Stddev_Samp_Order_By = {
  day_of_week?: InputMaybe<Order_By>;
  duration_minutes?: InputMaybe<Order_By>;
  order_index?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "weekly_structure" */
export type Weekly_Structure_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Weekly_Structure_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Weekly_Structure_Stream_Cursor_Value_Input = {
  activity_type?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamp"]["input"]>;
  day_of_week?: InputMaybe<Scalars["Int"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  duration_minutes?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  order_index?: InputMaybe<Scalars["Int"]["input"]>;
  stage_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Weekly_Structure_Sum_Fields = {
  __typename?: "weekly_structure_sum_fields";
  day_of_week?: Maybe<Scalars["Int"]["output"]>;
  duration_minutes?: Maybe<Scalars["Int"]["output"]>;
  order_index?: Maybe<Scalars["Int"]["output"]>;
};

/** order by sum() on columns of table "weekly_structure" */
export type Weekly_Structure_Sum_Order_By = {
  day_of_week?: InputMaybe<Order_By>;
  duration_minutes?: InputMaybe<Order_By>;
  order_index?: InputMaybe<Order_By>;
};

/** update columns of table "weekly_structure" */
export enum Weekly_Structure_Update_Column {
  /** column name */
  ActivityType = "activity_type",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DayOfWeek = "day_of_week",
  /** column name */
  Description = "description",
  /** column name */
  DurationMinutes = "duration_minutes",
  /** column name */
  Id = "id",
  /** column name */
  OrderIndex = "order_index",
  /** column name */
  StageId = "stage_id",
}

export type Weekly_Structure_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Weekly_Structure_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Weekly_Structure_Set_Input>;
  /** filter the rows which have to be updated */
  where: Weekly_Structure_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Weekly_Structure_Var_Pop_Fields = {
  __typename?: "weekly_structure_var_pop_fields";
  day_of_week?: Maybe<Scalars["Float"]["output"]>;
  duration_minutes?: Maybe<Scalars["Float"]["output"]>;
  order_index?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "weekly_structure" */
export type Weekly_Structure_Var_Pop_Order_By = {
  day_of_week?: InputMaybe<Order_By>;
  duration_minutes?: InputMaybe<Order_By>;
  order_index?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Weekly_Structure_Var_Samp_Fields = {
  __typename?: "weekly_structure_var_samp_fields";
  day_of_week?: Maybe<Scalars["Float"]["output"]>;
  duration_minutes?: Maybe<Scalars["Float"]["output"]>;
  order_index?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "weekly_structure" */
export type Weekly_Structure_Var_Samp_Order_By = {
  day_of_week?: InputMaybe<Order_By>;
  duration_minutes?: InputMaybe<Order_By>;
  order_index?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Weekly_Structure_Variance_Fields = {
  __typename?: "weekly_structure_variance_fields";
  day_of_week?: Maybe<Scalars["Float"]["output"]>;
  duration_minutes?: Maybe<Scalars["Float"]["output"]>;
  order_index?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "weekly_structure" */
export type Weekly_Structure_Variance_Order_By = {
  day_of_week?: InputMaybe<Order_By>;
  duration_minutes?: InputMaybe<Order_By>;
  order_index?: InputMaybe<Order_By>;
};
