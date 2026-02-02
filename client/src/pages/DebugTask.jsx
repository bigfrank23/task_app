// DebugTasks.jsx - Use this to test your API
import { useTasks } from "../utils/useTasksHook";
import useAuthStore from "../utils/authStore";

const DebugTasks = () => {
  const { user } = useAuthStore();
  
  const { 
    data: taskResponse, 
    isPending, 
    error,
    isFetching 
  } = useTasks({}, 1, 10);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔍 Task Debug Panel</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '8px' }}>
        <h3>👤 Current User</h3>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '8px' }}>
        <h3>📊 Query Status</h3>
        <p><strong>Is Pending:</strong> {isPending ? '✅ YES' : '❌ NO'}</p>
        <p><strong>Is Fetching:</strong> {isFetching ? '✅ YES' : '❌ NO'}</p>
        <p><strong>Has Error:</strong> {error ? '❌ YES' : '✅ NO'}</p>
      </div>

      {error && (
        <div style={{ marginBottom: '20px', padding: '15px', background: '#ffebee', borderRadius: '8px' }}>
          <h3>❌ Error Details</h3>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {JSON.stringify(error, null, 2)}
          </pre>
          {error.response && (
            <>
              <h4>Response Data:</h4>
              <pre>{JSON.stringify(error.response.data, null, 2)}</pre>
              <h4>Status Code:</h4>
              <p>{error.response.status}</p>
            </>
          )}
        </div>
      )}

      {taskResponse && (
        <>
          <div style={{ marginBottom: '20px', padding: '15px', background: '#e8f5e9', borderRadius: '8px' }}>
            <h3>✅ Full API Response</h3>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: '300px', overflow: 'auto' }}>
              {JSON.stringify(taskResponse, null, 2)}
            </pre>
          </div>

          <div style={{ marginBottom: '20px', padding: '15px', background: '#fff3e0', borderRadius: '8px' }}>
            <h3>📄 Pagination Info</h3>
            <pre>{JSON.stringify(taskResponse.pagination, null, 2)}</pre>
          </div>

          <div style={{ marginBottom: '20px', padding: '15px', background: '#f3e5f5', borderRadius: '8px' }}>
            <h3>📈 Statistics</h3>
            <pre>{JSON.stringify(taskResponse.stats, null, 2)}</pre>
          </div>

          <div style={{ marginBottom: '20px', padding: '15px', background: '#e1f5fe', borderRadius: '8px' }}>
            <h3>📝 Tasks ({taskResponse.data?.length || 0})</h3>
            {taskResponse.data && taskResponse.data.length > 0 ? (
              <div>
                <p><strong>Total Tasks:</strong> {taskResponse.data.length}</p>
                <h4>First Task:</h4>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {JSON.stringify(taskResponse.data[0], null, 2)}
                </pre>
                <h4>All Task IDs:</h4>
                <ul>
                  {taskResponse.data.map(task => (
                    <li key={task._id}>
                      {task._id} - {task.title} (Status: {task.status})
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div style={{ padding: '20px', background: '#fff', borderRadius: '4px', border: '2px dashed #ccc' }}>
                <p style={{ fontSize: '18px', color: '#999' }}>⚠️ No tasks in response</p>
                <p>Possible reasons:</p>
                <ul style={{ textAlign: 'left' }}>
                  <li>No tasks exist in database for this user</li>
                  <li>User ID mismatch between task.assignedTo and user._id</li>
                  <li>All tasks are archived (isArchived: true)</li>
                  <li>Database connection issue</li>
                </ul>
              </div>
            )}
          </div>
        </>
      )}

      {isPending && (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #535bf2',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '20px', fontSize: '18px' }}>Loading...</p>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{ marginTop: '30px', padding: '15px', background: '#fafafa', borderRadius: '8px' }}>
        <h3>🛠️ Quick Actions</h3>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            background: '#535bf2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Reload Page
        </button>
        <button 
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          style={{
            padding: '10px 20px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Clear Cache & Logout
        </button>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', background: '#fff9c4', borderRadius: '8px' }}>
        <h3>💡 Debugging Tips</h3>
        <ol style={{ textAlign: 'left' }}>
          <li>Check browser console for network requests</li>
          <li>Check Network tab for API responses</li>
          <li>Verify token is being sent in requests</li>
          <li>Check backend logs for query execution</li>
          <li>Verify tasks exist in MongoDB for this user</li>
          <li>Check user._id matches task.assignedTo in database</li>
        </ol>
      </div>
    </div>
  );
};

export default DebugTasks;

// Add this route to test:
// import DebugTasks from './pages/DebugTasks';
// <Route path="/debug-tasks" element={<DebugTasks />} />