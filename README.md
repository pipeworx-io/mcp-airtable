# mcp-airtable

Airtable MCP Pack — wraps the Airtable REST API v0

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `airtable_list_records` | Fetch records from an Airtable table with optional filtering by formula (e.g., "{Status} = 'Done'"). Returns record IDs, field values, and metadata. |
| `airtable_get_record` | Fetch a single Airtable record by its record ID (recXXXXXXXXXXXX) from a specified base and table. Returns all field values and record metadata including created/modified timestamps. |
| `airtable_create_record` | Add a new record to an Airtable table with specified field values. Returns the created record ID and full record data. |
| `airtable_list_bases` | List all Airtable bases the provided personal access token can access. Returns base IDs, names, and workspace info — use to discover baseId values needed by other airtable tools. |
| `airtable_get_base_schema` | Get the structure of an Airtable base—all tables, field names, field types, and configurations. Use first to understand available data before querying or creating records. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "airtable": {
      "url": "https://gateway.pipeworx.io/airtable/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Airtable data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
