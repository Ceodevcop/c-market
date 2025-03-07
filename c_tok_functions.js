import { serve } from "https://deno.land/x/sift@0.5.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient("YOUR_SUPABASE_URL", "YOUR_SUPABASE_KEY");

serve({
  "/verify_payment": async (req) => {
    const { paymentId, username } = await req.json();

    // Check payment with Pi Network API
    const paymentStatus = await fetch(`https://api.minepi.com/v2/payments/${paymentId}`, {
      headers: { "Authorization": `Key YOUR_PI_API_KEY` },
    }).then(res => res.json());

    if (paymentStatus && paymentStatus.status === "completed") {
      // Save to database
      await supabase.from("payments").insert([{ username, paymentId, status: "confirmed" }]);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    return new Response(JSON.stringify({ success: false }), { status: 400 });
  },
});
