        const amount = document.getElementById("amount");
        const fromCurrency = document.getElementById("from");
        const toCurrency = document.getElementById("to");
        const fromFlag = document.getElementById("from-flag");
        const toFlag = document.getElementById("to-flag");
        const msg = document.getElementById("msg");
        const convertBtn = document.getElementById("convert-btn");
        const swapBtn = document.getElementById("swap-btn");

        // URL for the API
        const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

        // dropdowns with currencies
        function populateDropdowns() {
            for (let currencyCode in countryList) {
                // For 'from' dropdown
                let fromOption = document.createElement("option");
                fromOption.value = currencyCode;
                fromOption.textContent = currencyCode;
                if (currencyCode === "USD") {
                    fromOption.selected = true;
                }
                fromCurrency.appendChild(fromOption);

                // For 'to' dropdown
                let toOption = document.createElement("option");
                toOption.value = currencyCode;
                toOption.textContent = currencyCode;
                if (currencyCode === "INR") {
                    toOption.selected = true;
                }
                toCurrency.appendChild(toOption);
            }
        }

        // Update the flag based on selected currency
        function updateFlag(element, isFrom) {
            const currencyCode = element.value;
            const countryCode = countryList[currencyCode];
            const flagImg = isFrom ? fromFlag : toFlag;
            flagImg.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
            flagImg.alt = `${countryCode} flag`;
        }

        // Convert-currency
        async function convertCurrency() {
            const amountVal = amount.value;
            if (amountVal === "" || amountVal < 1) {
                amount.value = "1";
                return;
            }

            const from = fromCurrency.value.toLowerCase();
            const to = toCurrency.value.toLowerCase();

            try {
                const response = await fetch(`${BASE_URL}/${from}.json`);
                const data = await response.json();
                
                if (data && data[from] && data[from][to]) {
                    const rate = data[from][to];
                    const convertedAmount = (amountVal * rate).toFixed(2);
                    msg.textContent = `${amountVal} ${from.toUpperCase()} = ${convertedAmount} ${to.toUpperCase()}`;
                } else {
                    throw new Error("Invalid currency data received");
                }
            } catch (error) {
                console.error("Error converting currency:", error);
                msg.textContent = "Error converting currency. Please try again.";
            }
        }

        // Swap-currencies
        function swapCurrencies() {
            const temp = fromCurrency.value;
            fromCurrency.value = toCurrency.value;
            toCurrency.value = temp;
            updateFlag(fromCurrency, true);
            updateFlag(toCurrency, false);
            convertCurrency();
        }

        // Event-listeners
        fromCurrency.addEventListener("change", () => updateFlag(fromCurrency, true));
        toCurrency.addEventListener("change", () => updateFlag(toCurrency, false));
        convertBtn.addEventListener("click", (e) => {
            e.preventDefault();
            convertCurrency();
        });
        swapBtn.addEventListener("click", (e) => {
            e.preventDefault();
            swapCurrencies();
        });
        amount.addEventListener("input", convertCurrency);

        // Initialize the app
        populateDropdowns();
        convertCurrency();
  