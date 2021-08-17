const request = window.indexedDB.open("Transaction", 1);

// Create schema
request.onupgradeneeded = event => {
	const db = event.target.result;

	const toDoListStore = db.createObjectStore("Transaction", {
		keyPath: "transactionID"
	});

	toDoListStore.createIndex("statusIndex", "status");
};

request.onsuccess = () => {
	const db = request.result;
	const transaction = db.transaction(["Transaction"], "readwrite");
	const transactionStore = transaction.objectStore("Transaction");
	const statusIndex = transactionStore.index("statusIndex");

	// Adds data to our objectStore
	transactionStore.add({ listID: "1", status: "complete" });
	transactionStore.add({ listID: "2", status: "in-progress" });
	transactionStore.add({ listID: "3", status: "in-progress" });
	transactionStore.add({ listID: "4", status: "backlog" });

	const getCursorRequest = transactionStore.openCursor();
	getCursorRequest.onsuccess = e => {
		const cursor = e.target.result;
		if (cursor) {
			if (cursor.value.status === "in-progress") {
				const todo = cursor.value;
				todo.status = "complete";
				cursor.update(todo);
			}
			cursor.continue();
		}
	};
};