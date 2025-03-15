document.getElementById("verifyForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const userId = document.getElementById("userId").value;
  // Simulate fetching account details (replace with actual API call)
  const accountDetails = {
    name: "John Doe",
    email: "johndoe@example.com",
    piecesOwned: ["cm5120102023", "cm5120202023"],
  };

  const resultDiv = document.getElementById("verifyResult");
  resultDiv.innerHTML = `
    <h2>Account Details</h2>
    <p><strong>Name:</strong> ${accountDetails.name}</p>
    <p><strong>Email:</strong> ${accountDetails.email}</p>
    <p><strong>Pieces Owned:</strong> ${accountDetails.piecesOwned.join(", ")}</p>
  `;
});
