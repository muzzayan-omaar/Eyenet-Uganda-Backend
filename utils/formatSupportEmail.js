export const formatSupportEmail = (data) => {
  return `
    <div style="font-family:Arial;padding:10px">
      <h2>🔧 New Technical Support Request</h2>

      <p><b>Name:</b> ${data.fullName}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p><b>Phone:</b> ${data.phone || "N/A"}</p>
      <p><b>Company:</b> ${data.company || "N/A"}</p>

      <hr/>

      <p><b>Product/System:</b> ${data.product}</p>
      <p><b>Issue Type:</b> ${data.issueType}</p>
      <p><b>Priority:</b> ${data.priority || "Normal"}</p>

      <hr/>

      <p><b>Description:</b></p>
      <p>${data.message}</p>
    </div>
  `;
};