import { json, type LoaderFunctionArgs } from “@remix-run/node”;
import { useLoaderData, useRevalidator, useFetcher } from “@remix-run/react”;
import { useEffect, useState } from “react”;

// Simulate data source
const mockData = {
users: [
{ id: 1, name: “Nguyễn Văn A”, email: “a@example.com” },
{ id: 2, name: “Trần Thị B”, email: “b@example.com” },
],
stats: {
totalUsers: 2,
activeUsers: 1,
lastUpdated: new Date().toISOString(),
}
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
// Simulate data fetching with timestamp
return json({
…mockData,
timestamp: Date.now(),
});
};

export default function Index() {
const data = useLoaderData<typeof loader>();
const revalidator = useRevalidator();
const [autoSync, setAutoSync] = useState(true);

// Auto-sync every 10 seconds
useEffect(() => {
if (!autoSync) return;

```
const interval = setInterval(() => {
  revalidator.revalidate();
}, 10000);

return () => clearInterval(interval);
```

}, [revalidator, autoSync]);

const lastUpdate = new Date(data.timestamp).toLocaleTimeString();

return (
<div style={{
fontFamily: “system-ui, sans-serif”,
lineHeight: “1.8”,
padding: “2rem”,
maxWidth: “800px”,
margin: “0 auto”
}}>
<div style={{
display: “flex”,
justifyContent: “space-between”,
alignItems: “center”,
marginBottom: “2rem”,
padding: “1rem”,
backgroundColor: “#f0f0f0”,
borderRadius: “8px”
}}>
<h1 style={{ margin: 0 }}>Dashboard</h1>
<div style={{ display: “flex”, alignItems: “center”, gap: “1rem” }}>
<label style={{ display: “flex”, alignItems: “center”, gap: “0.5rem” }}>
<input
type=“checkbox”
checked={autoSync}
onChange={(e) => setAutoSync(e.target.checked)}
/>
Auto Sync
</label>
<button
onClick={() => revalidator.revalidate()}
disabled={revalidator.state === “loading”}
style={{
padding: “0.5rem 1rem”,
backgroundColor: revalidator.state === “loading” ? “#ccc” : “#007bff”,
color: “white”,
border: “none”,
borderRadius: “4px”,
cursor: revalidator.state === “loading” ? “not-allowed” : “pointer”
}}
>
{revalidator.state === “loading” ? “Syncing…” : “Manual Sync”}
</button>
</div>
</div>

```
  <div style={{ marginBottom: "1rem", fontSize: "0.9rem", color: "#666" }}>
    Last updated: {lastUpdate} | Status: {autoSync ? "Auto-sync ON" : "Manual mode"}
  </div>

  <div style={{ 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
    gap: "1rem",
    marginBottom: "2rem"
  }}>
    <div style={{ 
      padding: "1rem", 
      backgroundColor: "#e3f2fd", 
      borderRadius: "8px" 
    }}>
      <h3 style={{ margin: "0 0 0.5rem 0", color: "#1976d2" }}>Total Users</h3>
      <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>
        {data.stats.totalUsers}
      </p>
    </div>
    <div style={{ 
      padding: "1rem", 
      backgroundColor: "#e8f5e8", 
      borderRadius: "8px" 
    }}>
      <h3 style={{ margin: "0 0 0.5rem 0", color: "#388e3c" }}>Active Users</h3>
      <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>
        {data.stats.activeUsers}
      </p>
    </div>
  </div>

  <h2>Users</h2>
  <div style={{ 
    border: "1px solid #ddd", 
    borderRadius: "8px", 
    overflow: "hidden" 
  }}>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead style={{ backgroundColor: "#f5f5f5" }}>
        <tr>
          <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #ddd" }}>
            ID
          </th>
          <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #ddd" }}>
            Name
          </th>
          <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #ddd" }}>
            Email
          </th>
        </tr>
      </thead>
      <tbody>
        {data.users.map((user, index) => (
          <tr key={user.id} style={{ 
            backgroundColor: index % 2 === 0 ? "white" : "#f9f9f9" 
          }}>
            <td style={{ padding: "0.75rem", borderBottom: "1px solid #eee" }}>
              {user.id}
            </td>
            <td style={{ padding: "0.75rem", borderBottom: "1px solid #eee" }}>
              {user.name}
            </td>
            <td style={{ padding: "0.75rem", borderBottom: "1px solid #eee" }}>
              {user.email}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
```

);
}
