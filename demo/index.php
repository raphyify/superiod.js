<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Superiod PHP API Demo</title>
  <style>
    :root {
      font: 16px/1.5 system-ui, sans-serif;
      color: #172033;
      background: #eef4f5;
    }

    body {
      max-width: 42rem;
      margin: 0 auto;
      padding: 3rem 1.25rem;
    }

    main {
      padding: 2rem;
      background: #fff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      box-shadow: 0 12px 30px #164e6320;
    }

    h1 {
      margin-top: 0;
    }

    form {
      display: grid;
      gap: 0.75rem;
    }

    label {
      display: grid;
      gap: 0.35rem;
      font-weight: 600;
    }

    input,
    button {
      box-sizing: border-box;
      font: inherit;
      padding: 0.7rem 0.8rem;
      border-radius: 7px;
    }

    input {
      border: 1px solid #94a3b8;
    }

    button {
      border: 0;
      color: #fff;
      background: #155e75;
      cursor: pointer;
    }

    button:disabled {
      cursor: wait;
      opacity: 0.6;
    }

    pre {
      min-height: 5rem;
      padding: 1rem;
      overflow: auto;
      background: #0f172a;
      color: #d9f99d;
      border-radius: 7px;
    }
  </style>
</head>

<body>
  <main>
    <h1>Superiod PHP API</h1>
    <p>This page sends a named rule and form data to <code>api.php</code>.</p>
    <form id="user-form">
      <label>
        Name
        <input name="name" value="Ada" required>
      </label>
      <button type="submit">Call PHP backend</button>
    </form>
    <pre id="result" aria-live="polite">Waiting for a request...</pre>
  </main>

  <script type="module" src="../superiod/superiod.js"></script>
  <script type="module">
    const api = Superiod.Api("./api.php", {
      saveUser: {
        action: "save_user",
        method: "POST",
      },
    });

    const form = document.querySelector("#user-form");
    const result = document.querySelector("#result");
    const submit = form.querySelector("button");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      submit.disabled = true;
      result.textContent = "Calling PHP...";

      try {
        const data = Object.fromEntries(new FormData(form));
        const response = await api.saveUser(data);
        result.textContent = JSON.stringify(response, null, 2);
      } catch (error) {
        result.textContent = error.message;
      } finally {
        submit.disabled = false;
      }
    });
  </script>
</body>

</html>