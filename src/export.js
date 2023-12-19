(async function exportWorkflow() {
  function getURL() {
    try {
      return JSON.parse(decodeURIComponent(document.getElementsByName("falcon-workflow/config/environment")[0].content))["data-core"].
        apiHost
    } catch {
      return "/api2"
    }
  }

  const csrfToken = document.querySelector("#cs-csrf-token").content;
  const id = window.location.pathname.split("/").pop();
  const apiURL = getURL();

  const response = await fetch(
    `${apiURL}/workflows/entities/definitions/v2?ids=${id}`,
    {
      headers: {
        "content-type": "application/json",
        "x-csrf-token": csrfToken
      },
      referrerPolicy: "no-referrer",
      method: "GET",
      mode: "cors",
      credentials: "include",
    }
  );

  const data = await response.json();
  const workflow = data.resources[0];

  const opts = {
    types: [
      {
        description: "Workflow File",
        accept: {
          "application/json": [".json"],
        },
      },
    ],
  };

  const handle = await window.showSaveFilePicker(opts);
  const writable = await handle.createWritable();
  await writable.write(JSON.stringify(workflow, null, 2));
  await writable.close();
})();
