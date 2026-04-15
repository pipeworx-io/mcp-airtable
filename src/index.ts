interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Airtable MCP Pack — wraps the Airtable REST API v0
 *
 * BYO key: _apiKey = personal access token.
 * Auth: Bearer token.
 * Tools: list/get records, create record, list bases, get base schema.
 */


const API = 'https://api.airtable.com/v0';

async function airtableGet(apiKey: string, path: string): Promise<unknown> {
  const res = await fetch(`${API}${path}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable API error (${res.status}): ${text}`);
  }
  return res.json();
}

async function airtablePost(apiKey: string, path: string, body: unknown): Promise<unknown> {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable API error (${res.status}): ${text}`);
  }
  return res.json();
}

const tools: McpToolExport['tools'] = [
  {
    name: 'airtable_list_records',
    description: 'List records from an Airtable table. Supports optional formula filtering.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Airtable personal access token' },
        baseId: { type: 'string', description: 'Airtable base ID (e.g., appXXXXXXXXXXXX)' },
        tableIdOrName: { type: 'string', description: 'Table ID or name' },
        filterByFormula: { type: 'string', description: 'Airtable formula to filter records (optional)' },
        maxRecords: { type: 'number', description: 'Maximum number of records to return (default 100)' },
      },
      required: ['_apiKey', 'baseId', 'tableIdOrName'],
    },
  },
  {
    name: 'airtable_get_record',
    description: 'Get a single record by ID from an Airtable table.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Airtable personal access token' },
        baseId: { type: 'string', description: 'Airtable base ID' },
        tableIdOrName: { type: 'string', description: 'Table ID or name' },
        recordId: { type: 'string', description: 'Record ID (e.g., recXXXXXXXXXXXX)' },
      },
      required: ['_apiKey', 'baseId', 'tableIdOrName', 'recordId'],
    },
  },
  {
    name: 'airtable_create_record',
    description: 'Create a new record in an Airtable table.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Airtable personal access token' },
        baseId: { type: 'string', description: 'Airtable base ID' },
        tableIdOrName: { type: 'string', description: 'Table ID or name' },
        fields: { type: 'object', description: 'Object of field name/value pairs to set on the new record' },
      },
      required: ['_apiKey', 'baseId', 'tableIdOrName', 'fields'],
    },
  },
  {
    name: 'airtable_list_bases',
    description: 'List all bases accessible to the authenticated user.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Airtable personal access token' },
      },
      required: ['_apiKey'],
    },
  },
  {
    name: 'airtable_get_base_schema',
    description: 'Get the schema (tables and fields) for an Airtable base.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Airtable personal access token' },
        baseId: { type: 'string', description: 'Airtable base ID' },
      },
      required: ['_apiKey', 'baseId'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = args._apiKey as string;

  switch (name) {
    case 'airtable_list_records': {
      const baseId = args.baseId as string;
      const table = encodeURIComponent(args.tableIdOrName as string);
      const params = new URLSearchParams();
      if (args.filterByFormula) params.set('filterByFormula', args.filterByFormula as string);
      if (args.maxRecords) params.set('maxRecords', String(args.maxRecords));
      const qs = params.toString();
      return airtableGet(apiKey, `/${baseId}/${table}${qs ? `?${qs}` : ''}`);
    }

    case 'airtable_get_record': {
      const baseId = args.baseId as string;
      const table = encodeURIComponent(args.tableIdOrName as string);
      const recordId = args.recordId as string;
      return airtableGet(apiKey, `/${baseId}/${table}/${recordId}`);
    }

    case 'airtable_create_record': {
      const baseId = args.baseId as string;
      const table = encodeURIComponent(args.tableIdOrName as string);
      const fields = args.fields as Record<string, unknown>;
      return airtablePost(apiKey, `/${baseId}/${table}`, { fields });
    }

    case 'airtable_list_bases': {
      return airtableGet(apiKey, '/meta/bases');
    }

    case 'airtable_get_base_schema': {
      const baseId = args.baseId as string;
      return airtableGet(apiKey, `/meta/bases/${baseId}/tables`);
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 10 } } satisfies McpToolExport;
