
(async function importWorkflow() {
  function getURL() {
    try {
      return JSON.parse(decodeURIComponent(document.getElementsByName("falcon-workflow/config/environment")[0].content))["data-core"].
        apiHost
    } catch {
      return "/api2"
    }
  }

  try {
    const apiURL = getURL();
    const csrfToken = document.querySelector("#cs-csrf-token").content;
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
    const { model, description, } = JSON.parse(await file.text());
    const newName = `Imported At (${Date.now()})`;


    const workflow = {
      name: newName, model: {
        ...model,
        name: newName,
        description: description ?? "",
        gateways: model.gateways ?? {},
        sub_models: model.sub_models ?? {},
      },
      description: description ?? "",
      enabled: false,
    };

    const response = await fetch(`${apiURL}/workflows/entities/definitions/v2`, {
      "headers": {
        "content-type": "application/json",
        "x-csrf-token": csrfToken
      },
      "referrerPolicy": "no-referrer",
      "body": JSON.stringify(workflow),
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });

    if (!response.ok) {
      console.log("Import failed", response)
      return;
    }

    const data = await response.json();
    const newWorkflow = data.resources[0];
    console.log("workflow id is", newWorkflow)
    window.location.reload();
  } catch (e) {
    console.error(e);
  }
})();
