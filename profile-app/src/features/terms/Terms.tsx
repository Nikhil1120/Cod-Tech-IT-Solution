export function Terms() {
  return (
    <div className="section">
      <h2>Terms and Services</h2>

      <div className="card">
        <h3>Community Terms of Use</h3>
        <p className="muted">Rules for using the app. Be respectful, follow community guidelines, and avoid misuse.</p>
      </div>

      <div className="card">
        <h3>Privacy Policy</h3>
        <p className="muted">We store only necessary personal data and never sell your information. Data is used to provide services like billing and notifications.</p>
      </div>

      <div className="card">
        <h3>Refund Policy</h3>
        <p className="muted">Maintenance and community services are generally non-refundable unless charged in error.</p>
      </div>

      <div className="card">
        <h3>Legal Disclaimers</h3>
        <p className="muted">The app is provided as-is without warranties. Members are responsible for maintaining accurate account information.</p>
      </div>

      <div className="card">
        <h3>Update Logs</h3>
        <p className="muted">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}

