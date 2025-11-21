import { getDrawsCollection } from "@/lib/db";

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

    // 3. Zapis losowania do bazy
    const doc = {
      drawerEmail,
      drawerName,
      receiverEmail,
      receiverName,
      createdAt: new Date(),
    };

    await draws.insertOne(doc);

    // 4. Zwracamy wynik - osoba 4 przechwyci to i wyśle maila
    return Response.json({ success: true, result: doc });
  } catch (err) {
    console.error("Błąd API /draw:", err);
    return Response.json(
      { error: "Wystąpił błąd serwera" },
      { status: 500 }
    );
  }
}
