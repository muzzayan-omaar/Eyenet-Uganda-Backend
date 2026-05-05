export const formatSalesEmail = (data) => {
  return `
    <div style="font-family:Arial;padding:10px">
      <h2>💼 New Sales Enquiry</h2>

      <p><b>Name:</b> ${data.fullName}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p><b>Phone:</b> ${data.phone || "N/A"}</p>
      <p><b>Company:</b> ${data.company || "N/A"}</p>

      <hr/>

      <p><b>Product:</b> ${data.product}</p>
      <p><b>Budget:</b> UGX ${data.budget || "Not specified"}</p>

      <hr/>

      <p><b>Message:</b></p>
      <p>${data.message}</p>
    </div>
  `;
};