export interface InvoiceBooking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  eventType: string;
  guestCount: number;
  sessionTime: string;
  pricing: {
    total: number;
    advancePaid: number;
    remainingBalance: number;
    basePrice?: number;
    foodAndBeverage?: number;
    themePrice?: number;
    servicesPrice?: number;
    tax?: number;
  };
  spaceId?: string;
}

export function generateAndPrintInvoice(booking: InvoiceBooking, spaces: any[], transaction?: any) {
  const selectedSpace = spaces.find(s => s.id === booking.spaceId) || spaces[0];
  const spaceName = selectedSpace ? selectedSpace.name : "Imperial Royal Sovereign Hall";

  const invoiceId = transaction?.id || `INV-${booking.id}-${Math.floor(1000 + Math.random() * 9000)}`;
  const transactionDate = transaction?.date || new Date().toISOString().split("T")[0];
  const paymentMode = transaction?.mode || "UPI Transfer";
  const refId = transaction?.referenceId || "Direct Settlement";

  // Calculate pricing fallbacks
  const basePrice = booking.pricing.basePrice || Math.round(booking.pricing.total * 0.5);
  const taxPrice = booking.pricing.tax || Math.round(booking.pricing.total * 0.18);
  const otherServices = booking.pricing.total - basePrice - taxPrice;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Invoice - ${booking.id}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Montserrat:wght@300;400;600;700&display=swap');
        
        :root {
          --accent: #C6A15B;
          --dark: #171717;
          --light-gray: #F5F4F0;
        }

        body {
          font-family: 'Montserrat', sans-serif;
          color: var(--dark);
          margin: 0;
          padding: 40px;
          background-color: #fff;
        }

        .invoice-box {
          max-width: 800px;
          margin: auto;
          border: 1px solid var(--accent);
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          position: relative;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid var(--accent);
          padding-bottom: 20px;
          margin-bottom: 30px;
        }

        .logo-section h1 {
          font-family: 'Cinzel', serif;
          font-size: 2rem;
          margin: 0 0 5px 0;
          color: var(--dark);
          letter-spacing: 2px;
        }

        .logo-section span {
          color: var(--accent);
          font-weight: 600;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 4px;
        }

        .company-details {
          text-align: right;
          font-size: 0.8rem;
          color: #5A5A5A;
          line-height: 1.5;
        }

        .invoice-meta {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 40px;
        }

        .meta-card {
          background-color: var(--light-gray);
          padding: 20px;
          border-radius: 8px;
          font-size: 0.85rem;
          line-height: 1.6;
        }

        .meta-card h3 {
          margin: 0 0 10px 0;
          color: var(--accent);
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 40px;
        }

        th {
          background-color: var(--dark);
          color: #fff;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 1px;
          padding: 12px;
          text-align: left;
        }

        td {
          padding: 14px 12px;
          border-bottom: 1px solid rgba(0,0,0,0.08);
          font-size: 0.85rem;
        }

        .total-section {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .total-table {
          width: 300px;
          margin-bottom: 0;
        }

        .total-table td {
          padding: 8px 12px;
          border: none;
        }

        .total-table tr.grand-total {
          border-top: 2px solid var(--accent);
          border-bottom: 2px solid var(--accent);
          font-weight: 700;
          font-size: 1.1rem;
        }

        .footer {
          margin-top: 60px;
          text-align: center;
          font-size: 0.75rem;
          color: #777;
          border-top: 1px solid rgba(0,0,0,0.08);
          padding-top: 20px;
        }

        .no-print-actions {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 30px;
        }

        .btn {
          padding: 10px 24px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
        }

        .btn-primary {
          background-color: var(--accent);
          color: #fff;
        }

        .btn-primary:hover {
          background-color: #b28e4e;
        }

        .btn-secondary {
          background-color: var(--dark);
          color: #fff;
        }

        .btn-secondary:hover {
          background-color: #333;
        }

        @media print {
          .no-print-actions {
            display: none;
          }
          body {
            padding: 0;
          }
          .invoice-box {
            border: none;
            box-shadow: none;
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="no-print-actions">
        <button class="btn btn-primary" onclick="window.print()">Print / Save as PDF</button>
        <button class="btn btn-secondary" onclick="window.close()">Close Window</button>
      </div>

      <div class="invoice-box">
        <div class="header">
          <div class="logo-section">
            <h1>GAARLANDZ</h1>
            <span>Royal Celebrations & Venues</span>
          </div>
          <div class="company-details">
            <strong>Gaarlandz Luxury Estate</strong><br>
            Mettupalayam Road, Coimbatore<br>
            Tamil Nadu, India<br>
            v4.gaarlandz@gmail.com | +91 80127 00700
          </div>
        </div>

        <div class="invoice-meta">
          <div class="meta-card">
            <h3>Invoice Details</h3>
            <strong>Invoice ID:</strong> ${invoiceId}<br>
            <strong>Reference ID:</strong> ${booking.id}<br>
            <strong>Invoice Date:</strong> ${transactionDate}<br>
            <strong>Payment Mode:</strong> ${paymentMode}<br>
            <strong>Bank Reference:</strong> ${refId}
          </div>
          <div class="meta-card">
            <h3>Customer & Venue</h3>
            <strong>Name:</strong> ${booking.customerName}<br>
            <strong>Phone:</strong> ${booking.customerPhone}<br>
            <strong>Email:</strong> ${booking.customerEmail}<br>
            <strong>Space Reserved:</strong> ${spaceName}<br>
            <strong>Celebration Date:</strong> ${booking.date} (${booking.sessionTime})
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty / Details</th>
              <th style="text-align: right;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Bespoke Venue Space Charges</strong><br><small>Rental for ${spaceName}</small></td>
              <td>1 Space Block</td>
              <td style="text-align: right;">₹${basePrice.toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>Catering & Allied Services</strong><br><small>Premium banquet services for ${booking.guestCount} guests</small></td>
              <td>${booking.guestCount} Guests</td>
              <td style="text-align: right;">₹${otherServices.toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>Integrated Event Coordination</strong><br><small>Sound, safety checklist setup & concierge planning</small></td>
              <td>Inclusive</td>
              <td style="text-align: right;">Included</td>
            </tr>
          </tbody>
        </table>

        <div class="total-section">
          <table class="total-table">
            <tr>
              <td>Subtotal</td>
              <td style="text-align: right;">₹${(booking.pricing.total - taxPrice).toLocaleString()}</td>
            </tr>
            <tr>
              <td>GST/Taxes (18%)</td>
              <td style="text-align: right;">₹${taxPrice.toLocaleString()}</td>
            </tr>
            <tr class="grand-total">
              <td>Total</td>
              <td style="text-align: right;">₹${booking.pricing.total.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="color: green; font-weight: 600;">Advance Paid</td>
              <td style="text-align: right; color: green; font-weight: 600;">₹${booking.pricing.advancePaid.toLocaleString()}</td>
            </tr>
            <tr style="border-top: 1px solid rgba(0,0,0,0.1);">
              <td style="color: #A8352A; font-weight: 600;">Balance Due</td>
              <td style="text-align: right; color: #A8352A; font-weight: 600;">₹${booking.pricing.remainingBalance.toLocaleString()}</td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 50px; display: flex; justify-content: space-between; font-size: 0.8rem;">
          <div>
            <p><strong>Prepared By:</strong></p>
            <br><br>
            <p>_______________________</p>
            <p style="color: #777;">Operations Director</p>
          </div>
          <div style="text-align: right;">
            <p><strong>Client Signature:</strong></p>
            <br><br>
            <p>_______________________</p>
            <p style="color: #777;">Authorized Representative</p>
          </div>
        </div>

        <div class="footer">
          Thank you for choosing Gaarlandz. We look forward to hosting your signature celebration.
        </div>
      </div>

      <script>
        // Auto trigger print dialog on load
        window.addEventListener('DOMContentLoaded', () => {
          setTimeout(() => {
            window.print();
          }, 500);
        });
      </script>
    </body>
    </html>
  `;

  const newWindow = window.open("", "_blank", "width=850,height=900");
  if (newWindow) {
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  } else {
    alert("Popup blocker active! Please allow popups to print / save your invoice.");
  }
}
