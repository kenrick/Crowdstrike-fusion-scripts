(async function updateWorkflow() {
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
  const originalWorkflow = data.resources[0];

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

  const [handle] = await window.showOpenFilePicker(opts);
  const file = await handle.getFile();
  const { name, description, enabled } = originalWorkflow;
  const { model } = JSON.parse(await file.text());

  const newWorkflow = {
    name, description, enabled, model: {
      ...model,
      name,
      description,
      gateways: model.gateways ?? {},
      sub_models: model.sub_models ?? {},
    },
    id,
  };

  const response2 = await fetch(`${apiURL}/workflows/entities/definitions/v2`, {
    "headers": {
      "content-type": "application/json",
      "x-csrf-token": csrfToken
    },
    "referrerPolicy": "no-referrer",
    "body": JSON.stringify(newWorkflow),
    "method": "PUT",
    "mode": "cors",
    "credentials": "include"
  });


  if (!response2.ok) {
    console.log("Import failed", response2)
    return;
  }

  const data2 = await response2.json();
  const updatedWorkflow = data2.resources[0];
  console.log("workflow id is", updatedWorkflow)
  window.location.reload();
})();
