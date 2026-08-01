export const mockHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Expense Tracker</title>
  <style>
    :root {
      --bg: #f0f4f8;
      --surface: #ffffff;
      --text: #1a2332;
      --muted: #64748b;
      --border: #e2e8f0;
      --accent: #0d9488;
      --accent-hover: #0f766e;
      --danger: #dc2626;
      --danger-bg: #fef2f2;
      --shadow: 0 4px 24px rgba(15, 23, 42, 0.08);
      --radius: 12px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
      background: linear-gradient(160deg, #e0f2fe 0%, #f0f4f8 40%, #ecfdf5 100%);
      color: var(--text);
      min-height: 100vh;
      line-height: 1.5;
      padding: 2rem 1rem 3rem;
    }

    .page {
      max-width: 720px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }

    h1 {
      font-size: 1.75rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      text-align: center;
      color: var(--text);
    }

    h1 span {
      color: var(--accent);
    }

    h2 {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .card {
      background: var(--surface);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      border: 1px solid var(--border);
      padding: 1.5rem;
    }

    label {
      display: block;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--muted);
      margin-bottom: 0.35rem;
    }

    input,
    select {
      width: 100%;
      padding: 0.65rem 0.85rem;
      border: 1px solid var(--border);
      border-radius: 8px;
      font-size: 0.95rem;
      color: var(--text);
      background: #f8fafc;
      margin-bottom: 1rem;
      transition: border-color 0.15s ease;
    }

    input:focus,
    select:focus {
      outline: none;
      border-color: var(--accent);
      background: #fff;
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.7rem 1.25rem;
      border: none;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: default;
      background: var(--accent);
      color: #fff;
      transition: background 0.15s ease;
    }

    button:hover {
      background: var(--accent-hover);
    }

    .btn-block {
      width: 100%;
    }

    .btn-outline {
      background: transparent;
      color: var(--accent);
      border: 1.5px solid var(--accent);
    }

    .btn-outline:hover {
      background: #f0fdfa;
    }

    [data-testid="msg-error"] {
      background: var(--danger-bg);
      color: var(--danger);
      border: 1px solid #fecaca;
      border-radius: 8px;
      padding: 0.65rem 0.85rem;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    .summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .summary-label {
      font-size: 0.85rem;
      color: var(--muted);
      font-weight: 500;
    }

    [data-testid="text-total-spent"] {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--accent);
      letter-spacing: -0.02em;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    @media (max-width: 520px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;
    }

    thead th {
      text-align: left;
      font-weight: 600;
      color: var(--muted);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 0.65rem 0.75rem;
      border-bottom: 2px solid var(--border);
    }

    tbody td {
      padding: 0.75rem;
      border-bottom: 1px solid var(--border);
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    .amount {
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }

    .category-tag {
      display: inline-block;
      padding: 0.2rem 0.55rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
      background: #f0fdfa;
      color: var(--accent);
    }
  </style>
</head>
<body>
  <div class="page">
    <h1>Expense <span>Tracker</span></h1>

    <section class="card" aria-labelledby="login-heading">
      <h2 id="login-heading">Sign in</h2>
      <div data-testid="msg-error">Invalid email or password. Please try again.</div>
      <label for="email">Email</label>
      <input
        id="email"
        type="email"
        data-testid="input-email"
        placeholder="you@example.com"
        autocomplete="username"
      />
      <label for="password">Password</label>
      <input
        id="password"
        type="password"
        data-testid="input-password"
        placeholder="••••••••"
        autocomplete="current-password"
      />
      <button type="button" data-testid="btn-login" class="btn-block">Log in</button>
    </section>

    <section class="card summary" aria-labelledby="dashboard-heading">
      <div>
        <p class="summary-label" id="dashboard-heading">Total spent</p>
        <p data-testid="text-total-spent">$1,284.50</p>
      </div>
      <button type="button" data-testid="btn-new-transaction" class="btn-outline">
        New transaction
      </button>
    </section>

    <section class="card" aria-labelledby="form-heading">
      <h2 id="form-heading">Add expense</h2>
      <div class="form-row">
        <div>
          <label for="amount">Amount</label>
          <input
            id="amount"
            type="number"
            data-testid="input-amount"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label for="category">Category</label>
          <select id="category" data-testid="select-category">
            <option value="">Select category</option>
            <option value="food">Food</option>
            <option value="travel">Travel</option>
            <option value="utilities">Utilities</option>
            <option value="entertainment">Entertainment</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <button type="button" data-testid="btn-save-expense" class="btn-block">
        Save expense
      </button>
    </section>

    <section class="card" aria-labelledby="table-heading">
      <h2 id="table-heading">Recent expenses</h2>
      <table data-testid="table-expenses">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2026-07-28</td>
            <td><span class="category-tag">Food</span></td>
            <td>Grocery run</td>
            <td class="amount">$64.20</td>
          </tr>
          <tr>
            <td>2026-07-25</td>
            <td><span class="category-tag">Travel</span></td>
            <td>Uber to airport</td>
            <td class="amount">$42.00</td>
          </tr>
          <tr>
            <td>2026-07-20</td>
            <td><span class="category-tag">Utilities</span></td>
            <td>Electric bill</td>
            <td class="amount">$118.30</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</body>
</html>`;