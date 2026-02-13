// Re-export schema from the server package for MCP server use.
// In a production monorepo this would be a shared DB package.
export {
  sources,
  actions,
  reports,
} from "../../server/src/db/schema";
