# mcp-airtable

Airtable MCP Pack — wraps the Airtable REST API v0

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `airtable_list_records` | List records from an Airtable table. Supports optional formula filtering. |
| `airtable_get_record` | Get a single record by ID from an Airtable table. |
| `airtable_create_record` | Create a new record in an Airtable table. |
| `airtable_list_bases` | List all bases accessible to the authenticated user. |
| `airtable_get_base_schema` | Get the schema (tables and fields) for an Airtable base. |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "airtable": {
      "url": "https://gateway.pipeworx.io/airtable/mcp"
    }
  }
}
```

Or use the CLI:

```bash
npx pipeworx use airtable
```

## License

MIT
