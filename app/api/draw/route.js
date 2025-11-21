import { getDrawsCollection } from "@/lib/db";
import { sendDrawEmail } from "@/lib/emailservice";

export async function POST(req) {
  try {
    const { drawerEmail, drawerName, receiverEmail, receiverName } =
      await req.json();

    const draws = await getDrawsCollection();

    // 1. Czy ta osoba już losowała?
    const alreadyDrew = await draws.findOne({ drawerEmail });
    if (alreadyDrew) {
      return Response.json(
        { error: "Ta osoba już losowała!" },
        { status: 400 }
      );
    }

    // 2. Czy ta osoba została już wylosowana?
    const alreadyReceived = await draws.findOne({ receiverEmail });
    if (alreadyReceived) {
      return Response.json(
        { error: "Ta osoba została już wylosowana!" },
        { status: 400 }
      );
    }

    // 3. Przygotowanie dokumentu do zapisu
    const doc = {
      drawerEmail,
      drawerName,
      receiverEmail,
      receiverName,
      createdAt: new Date(),
    };

    // 4. Zapis do bazy~~
    await draws.insertOne(doc);

    // 5. Wysyłka maila — Twoja część
    await sendDrawEmail({
      to: drawerEmail,
      drawerName,
      receiverName,
      receiverEmail,
    });

    // 6. Zwracamy wynik
    return Response.json({ success: true, result: doc });
  } catch (err) {
    console.error("Błąd API /draw:", err);
    return Response.json(
      { error: "Wystąpił błąd serwera" },
      { status: 500 }
    );
  }
}
