// ==========================================
// REMITAXISGLOBAL
// UPDATED SCRIPT.JS
// PHASE 19 — SPCK VERSION
// ==========================================


// ==========================================
// CHECK LOGIN BEFORE TRANSFER
// ==========================================

function checkTransferAccess() {

    if (typeof requireLogin === "function") {

        return requireLogin();

    }

    const token =
        localStorage.getItem(
            "remitaxisglobalToken"
        );

    if (!token) {

        window.location.href =
            "login.html";

        return false;

    }

    return true;
}


// ==========================================
// CREATE TRANSFER
// ==========================================

function createAuthenticatedTransfer() {

    if (!checkTransferAccess()) {

        return;

    }


    const recipient =
        document.getElementById(
            "recipientName"
        );

    const amount =
        document.getElementById(
            "transferAmount"
        );

    const from =
        document.getElementById(
            "transferFrom"
        );

    const to =
        document.getElementById(
            "transferTo"
        );

    const result =
        document.getElementById(
            "transferResult"
        );


    if (
        !recipient ||
        !amount ||
        !from ||
        !to ||
        !result
    ) {

        return;

    }


    const recipientName =
        recipient.value.trim();


    const amountNumber =
        Number(amount.value);


    if (!recipientName) {

        result.textContent =
            "Please enter a recipient.";

        return;

    }


    if (
        !Number.isFinite(amountNumber) ||
        amountNumber <= 0
    ) {

        result.textContent =
            "Please enter a valid amount.";

        return;

    }


    if (
        from.value === to.value
    ) {

        result.textContent =
            "Send and receive currencies must be different.";

        return;

    }


    // ======================================
    // DEMO EXCHANGE RATES
    // ======================================

    const rates = {

        USD_ZAR: 17.80,

        USD_KES: 129.50,

        USD_GBP: 0.74,

        USD_EUR: 0.85,

        USD_ZMW: 24.90,

        USD_BWP: 13.60

    };


    let rate = 1;


    const directRate =
        rates[
            from.value +
            "_" +
            to.value
        ];


    const reverseRate =
        rates[
            to.value +
            "_" +
            from.value
        ];


    if (directRate) {

        rate =
            directRate;

    } else if (reverseRate) {

        rate =
            1 / reverseRate;

    } else {

        result.textContent =
            "This currency pair is not available in demo mode.";

        return;

    }


    const receivedAmount =
        amountNumber * rate;


    // ======================================
    // CREATE TRANSFER OBJECT
    // ======================================

    const transfer = {

        id:
            "RAG-" +
            Date.now(),

        recipient:
            recipientName,

        amount:
            amountNumber,

        fromCurrency:
            from.value,

        toCurrency:
            to.value,

        exchangeRate:
            rate,

        receivedAmount:
            receivedAmount,

        status:
            "Planned",

        createdAt:
            new Date().toISOString()

    };


    // ======================================
    // GET EXISTING TRANSFERS
    // ======================================

    let transfers = [];


    try {

        transfers =
            JSON.parse(
                localStorage.getItem(
                    "remitaxisglobalTransfers"
                )
            ) || [];

    } catch {

        transfers = [];

    }


    // ======================================
    // SAVE TRANSFER
    // ======================================

    transfers.push(
        transfer
    );


    localStorage.setItem(

        "remitaxisglobalTransfers",

        JSON.stringify(
            transfers
        )

    );


    // ======================================
    // SUCCESS MESSAGE
    // ======================================

    result.textContent =
        "✓ Transfer saved successfully. ID: " +
        transfer.id;


    // ======================================
    // CLEAR FORM
    // ======================================

    recipient.value = "";

    amount.value = "";


    // ======================================
    // NOTIFICATION
    // ======================================

    if (
        typeof showNotification ===
        "function"
    ) {

        showNotification(
            "Transfer created successfully.",
            "success"
        );

    }


    // ======================================
    // REFRESH DASHBOARD
    // ======================================

    if (
        document.getElementById(
            "transactionList"
        )
    ) {

        loadMyTransfers();

    }

}


// ==========================================
// LOAD USER TRANSFERS
// ==========================================

function loadMyTransfers() {

    const container =
        document.getElementById(
            "transactionList"
        );


    if (!container) {

        return;

    }


    if (!checkTransferAccess()) {

        return;

    }


    let transfers = [];


    try {

        transfers =
            JSON.parse(
                localStorage.getItem(
                    "remitaxisglobalTransfers"
                )
            ) || [];

    } catch {

        transfers = [];

    }


    renderTransactions(
        transfers
    );


    updateDashboardStats(
        transfers
    );

}


// ==========================================
// RENDER TRANSACTIONS
// ==========================================

function renderTransactions(
    transactions
) {

    const container =
        document.getElementById(
            "transactionList"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (
        !transactions ||
        transactions.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                You have no transfers yet.

            </div>

        `;

        return;

    }


    transactions
        .slice()
        .reverse()
        .forEach(
            function(transaction) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "transaction-item";


                const recipient =
                    typeof escapeHTML ===
                    "function"

                        ? escapeHTML(
                            transaction.recipient
                        )

                        : String(
                            transaction.recipient
                        );


                item.innerHTML = `

                    <div>

                        <strong>
                            ${recipient}
                        </strong>

                        <p>
                            ${transaction.id}
                        </p>

                    </div>


                    <div>

                        <strong>

                            ${Number(
                                transaction.amount
                            ).toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }
                            )}

                            ${transaction.fromCurrency}

                        </strong>

                        <p>

                            →

                            ${Number(
                                transaction.receivedAmount
                            ).toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }
                            )}

                            ${transaction.toCurrency}

                        </p>

                    </div>


                    <div>

                        <span class="status-badge">

                            ${transaction.status}

                        </span>

                    </div>

                `;


                container.appendChild(
                    item
                );

            }
        );

}


// ==========================================
// DASHBOARD STATISTICS
// ==========================================

function updateDashboardStats(
    transfers
) {

    transfers =
        transfers || [];


    const transferCount =
        document.getElementById(
            "transferCount"
        );


    const totalVolume =
        document.getElementById(
            "totalVolume"
        );


    const completedCount =
        document.getElementById(
            "completedCount"
        );


    const savedCount =
        document.getElementById(
            "savedCount"
        );


    if (transferCount) {

        transferCount.textContent =
            transfers.length;

    }


    if (savedCount) {

        savedCount.textContent =
            transfers.length;

    }


    if (completedCount) {

        completedCount.textContent =

            transfers.filter(
                function(transfer) {

                    return (
                        transfer.status ===
                        "Completed"
                    );

                }
            ).length;

    }


    if (totalVolume) {

        let total = 0;


        transfers.forEach(
            function(transfer) {

                total += Number(
                    transfer.amount
                ) || 0;

            }
        );


        totalVolume.textContent =

            "$" +

            total.toLocaleString(
                undefined,
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

    }

}


// ==========================================
// SEARCH TRANSACTIONS
// ==========================================

function searchTransactions() {

    const search =
        document.getElementById(
            "transactionSearch"
        );


    if (!search) {

        return;

    }


    let transfers = [];


    try {

        transfers =
            JSON.parse(
                localStorage.getItem(
                    "remitaxisglobalTransfers"
                )
            ) || [];

    } catch {

        transfers = [];

    }


    const query =
        search.value
            .trim()
            .toLowerCase();


    if (!query) {

        renderTransactions(
            transfers
        );

        return;

    }


    const filtered =
        transfers.filter(
            function(transfer) {

                return (

                    String(
                        transfer.recipient
                    )
                    .toLowerCase()
                    .includes(query)

                    ||

                    String(
                        transfer.id
                    )
                    .toLowerCase()
                    .includes(query)

                    ||

                    String(
                        transfer.status
                    )
                    .toLowerCase()
                    .includes(query)

                );

            }
        );


    renderTransactions(
        filtered
    );

}


// ==========================================
// FILTER TRANSACTIONS
// ==========================================

function filterTransactions() {

    const filter =
        document.getElementById(
            "transactionFilter"
        );


    if (!filter) {

        return;

    }


    let transfers = [];


    try {

        transfers =
            JSON.parse(
                localStorage.getItem(
                    "remitaxisglobalTransfers"
                )
            ) || [];

    } catch {

        transfers = [];

    }


    if (
        filter.value ===
        "all"
    ) {

        renderTransactions(
            transfers
        );

        return;

    }


    const filtered =
        transfers.filter(
            function(transfer) {

                return (
                    transfer.status ===
                    filter.value
                );

            }
        );


    renderTransactions(
        filtered
    );

}


// ==========================================
// PAGE START
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        // Dashboard

        if (
            document.getElementById(
                "transactionList"
            )
        ) {

            loadMyTransfers();

        }

    }
);