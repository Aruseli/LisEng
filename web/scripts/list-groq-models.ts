async function main() {
  const res = await fetch('https://api.groq.com/openai/v1/models', {
    headers: { authorization: `Bearer ${process.env.GROQ_API_KEY}` },
  })
  if (!res.ok) {
    console.error('HTTP', res.status, await res.text())
    process.exit(1)
  }
  const json = (await res.json()) as { data: Array<{ id: string }> }
  console.log(json.data.map((m) => m.id).join('\n'))
}

main()
