const AdminDashboard = () => {
    return (
        <div>
            <section className="admin-stats-grid">
                {[
                    { label: "Total Books", hint: "Inventory count" },
                    { label: "Total Users", hint: "Registered members" },
                    { label: "Borrow Requests", hint: "Pending reviews" },
                    { label: "Account Requests", hint: "Awaiting approval" },
                ].map((stat) => (
                    <div key={stat.label} className="admin-stat-card">
                        <p className="admin-stat-label">{stat.label}</p>
                        <p className="admin-stat-value">—</p>
                        <p className="admin-stat-hint">{stat.hint}</p>
                    </div>
                ))}
            </section>

            <div className="admin-panels">
                <section className="admin-panel">
                    <div className="admin-panel-header">
                        <h2 className="admin-panel-title">Recent Activity</h2>
                    </div>
                    <div className="admin-panel-empty">
                        Activity data will appear here
                    </div>
                </section>

                <section className="admin-panel">
                    <div className="admin-panel-header">
                        <h2 className="admin-panel-title">Quick Actions</h2>
                    </div>
                    <div className="admin-panel-empty">
                        Actions will appear here
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;
