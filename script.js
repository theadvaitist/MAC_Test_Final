document.addEventListener("DOMContentLoaded", () => {
    const choiceSetDiv = document.getElementById("choiceSet");
    const endMessageDiv = document.getElementById("endMessage");
    const nameForm = document.getElementById("nameForm");
    const usernameInput = document.getElementById("username");

    // User data and time tracking
    let userData = [];
    let startTime = null;
    let hoverStartTimes = {};
    let attributeHoverTimes = {};

    // Product sets
    const productSets = [
        // Choice Set 1
        [
            { name: "Product A", size: "100 ml", quality: "85% organic, tested", effectiveness: "SPF 30, anti-aging", longevity: "6 months", origin: "Locally sourced", price: "₹750" },
            { name: "Product B", size: "120 ml", quality: "90% organic, not tested", effectiveness: "SPF 50, sun protection", longevity: "4 months", origin: "Imported", price: "₹900" },
            { name: "Product C", size: "90 ml", quality: "80% organic, tested", effectiveness: "SPF 25, hydration only", longevity: "5 months", origin: "Locally sourced", price: "₹700" }
        ],
        // Choice Set 2
        [
            { name: "Product A", price: "₹850", size: "120 ml", quality: "80% organic, tested", effectiveness: "SPF 25, hydration only", longevity: "5 months", origin: "Imported, eco-friendly" },
            { name: "Product B", price: "₹1,050", size: "150 ml", quality: "90% organic, not tested", effectiveness: "SPF 50, sun protection", longevity: "3 months", origin: "Imported, not eco-friendly" },
            { name: "Product C", price: "₹820", size: "110 ml", quality: "75% organic, tested", effectiveness: "SPF 20, hydration only", longevity: "4 months", origin: "Locally sourced, partially eco-friendly" }
        ],
        // Choice Set 3
        [
            { name: "Product A", quality: "90% organic, tested", price: "₹950", size: "130 ml", effectiveness: "SPF 30, anti-aging", longevity: "6 months", origin: "Locally sourced, eco-friendly" },
            { name: "Product B", quality: "95% organic, not tested", price: "₹1,200", size: "160 ml", effectiveness: "SPF 50, sun protection", longevity: "4 months", origin: "Imported, eco-friendly" },
            { name: "Product C", quality: "85% organic, tested", price: "₹910", size: "120 ml", effectiveness: "SPF 25, hydration only", longevity: "5 months", origin: "Locally sourced, partially eco-friendly" }
        ]
    ];

    let currentSetIndex = 0;

    // Event listener for name submission
    nameForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim();
        if (username) {
            userData.push({ name: username });
            nameForm.parentElement.classList.add("hidden");
            showChoiceSet();
        }
    });

    // Display the current choice set
    function showChoiceSet() {
        choiceSetDiv.innerHTML = ""; // Clear previous set
        choiceSetDiv.classList.remove("hidden");

        const currentSet = productSets[currentSetIndex];
        startTime = new Date().getTime(); // Start timing
        attributeHoverTimes = {}; // Reset hover times

        currentSet.forEach((product) => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");

            const productName = document.createElement("h3");
            productName.textContent = product.name;
            productCard.appendChild(productName);

            const attributesList = document.createElement("ul");
            for (let [key, value] of Object.entries(product)) {
                if (key !== "name") {
                    const listItem = document.createElement("li");
                    listItem.textContent = `${key}: ${value}`;
                    listItem.dataset.attribute = key;

                    listItem.addEventListener("mouseenter", () => {
                        hoverStartTimes[key] = new Date().getTime();
                    });

                    listItem.addEventListener("mouseleave", () => {
                        const hoverEndTime = new Date().getTime();
                        const hoverTime = hoverEndTime - hoverStartTimes[key];
                        attributeHoverTimes[key] = (attributeHoverTimes[key] || 0) + hoverTime;
                    });

                    attributesList.appendChild(listItem);
                }
            }
            productCard.appendChild(attributesList);

            const selectButton = document.createElement("button");
            selectButton.textContent = "Select";
            selectButton.addEventListener("click", () => {
                recordSelection(product);
            });
            productCard.appendChild(selectButton);

            choiceSetDiv.appendChild(productCard);
        });
    }

    // Record the selected product and move to the next set
    function recordSelection(product) {
        const endTime = new Date().getTime();
        const timeTaken = endTime - startTime;

        userData.push({
            choiceSet: currentSetIndex + 1,
            selectedProduct: product.name,
            timeTaken: timeTaken,
            attributeHoverTimes: { ...attributeHoverTimes }
        });

        currentSetIndex++;
        if (currentSetIndex < productSets.length) {
            showChoiceSet();
        } else {
            endExperiment();
        }
    }

    // End the experiment and create Excel file
    function endExperiment() {
        choiceSetDiv.classList.add("hidden");
        endMessageDiv.classList.remove("hidden");
        createExcelFile();
    }

    // Create and download Excel file
    function createExcelFile() {
        const workbook = XLSX.utils.book_new();
        const worksheetData = userData.map((data) => ({
            Name: data.name || "",
            ChoiceSet: data.choiceSet || "",
            SelectedProduct: data.selectedProduct || "",
            TimeTaken: data.timeTaken || "",
            ...data.attributeHoverTimes
        }));
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "User Data");
        XLSX.writeFile(workbook, "user_data.xlsx");
    }
});
