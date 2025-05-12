import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import { Resend } from "npm:resend@3.2.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

interface BookingData {
  property_size: string;
  services: Array<{
    name: string;
    price: number;
    count: number;
    total: number;
  }>;
  total_amount: number;
  address: {
    street: string;
    street2?: string;
    city: string;
    province: string;
    zipCode: string;
  };
  notes: string | null;
  preferred_date: string;
  property_status: string;
  agent_name: string;
  agent_email: string;
  agent_phone: string;
  agent_company: string | null;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const { record } = await req.json() as { record: BookingData };

    // Format services for email
    const servicesList = record.services
      .map(
        (service) =>
          `${service.name} (${service.count}x) - $${service.total.toFixed(2)}`
      )
      .join("\n");

    // Format address
    const fullAddress = [
      record.address.street,
      record.address.street2,
      record.address.city,
      record.address.province,
      record.address.zipCode,
    ]
      .filter(Boolean)
      .join(", ");

    // Send email to agent
    await resend.emails.send({
      from: "bookings@yourdomain.com",
      to: record.agent_email,
      subject: "Booking Confirmation",
      html: `
        <h1>Booking Confirmation</h1>
        <p>Thank you for your booking, ${record.agent_name}!</p>
        
        <h2>Booking Details</h2>
        <p><strong>Property Size:</strong> ${record.property_size}</p>
        <p><strong>Property Status:</strong> ${record.property_status}</p>
        <p><strong>Address:</strong> ${fullAddress}</p>
        <p><strong>Preferred Date:</strong> ${record.preferred_date}</p>
        
        <h2>Services</h2>
        <pre>${servicesList}</pre>
        
        <p><strong>Total Amount:</strong> $${record.total_amount.toFixed(2)}</p>
        
        <h2>Agent Information</h2>
        <p><strong>Name:</strong> ${record.agent_name}</p>
        <p><strong>Email:</strong> ${record.agent_email}</p>
        <p><strong>Phone:</strong> ${record.agent_phone}</p>
        ${record.agent_company ? `<p><strong>Company:</strong> ${record.agent_company}</p>` : ''}
        
        ${record.notes ? `<h2>Additional Notes</h2><p>${record.notes}</p>` : ''}
      `,
    });

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    
    return new Response(
      JSON.stringify({
        error: "Failed to send email",
        details: error.message,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});