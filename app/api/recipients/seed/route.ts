import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Predefined mapping of email addresses to plants / disciplines
const RAW_RECIPIENT_DATA = {
  plant: {
    "Ammonia & Laboratory": [
      "dan.kelleher@incitecpivot.com.au",
      "michael.soper@incitecpivot.com.au",
      "jessica.nieto@incitecpivot.com.au",
      "michael.giesen@incitecpivot.com.au",
      "bill.anderson@incitecpivot.com.au",
      "stewart.bache@incitecpivot.com.au",
      "noreen.lyon@incitecpivot.com.au",
      "narelle.schmid@incitecpivot.com.au",
      "bruce.verzeletti@incitecpivot.com.au",
      "theodore.moschoudis@incitecpivot.com.au",
      "warren.jones@incitecpivot.com.au",
      "ashley.bels@incitecpivot.com.au",
      "fouad.gaber@incitecpivot.com.au",
      "donnavan.dippenaar@incitecpivot.com.au",
      "ben.smith@incitecpivot.com.au",
      "gavin.humphreys@incitecpivot.com.au",
      "jeremy.bill@incitecpivot.com.au",
      "john.kendal@incitecpivot.com.au",
      "amber.rowlandson@incitecpivot.com.au",
    ],
    "Camp & Aviation": [
      "dan.kelleher@incitecpivot.com.au",
      "michael.soper@incitecpivot.com.au",
      "jessica.nieto@incitecpivot.com.au",
      "michael.giesen@incitecpivot.com.au",
      "sonya.inwood@incitecpivot.com.au",
      "gavin.marty@incitecpivot.com.au",
    ],
    "Granulation & Material Handling": [
      "dan.kelleher@incitecpivot.com.au",
      "michael.soper@incitecpivot.com.au",
      "jessica.nieto@incitecpivot.com.au",
      "michael.giesen@incitecpivot.com.au",
      "michael.martini@incitecpivot.com.au",
      "bill.anderson@incitecpivot.com.au",
      "scott.turner@incitecpivot.com.au",
      "tony.young@incitecpivot.com.au",
      "william.page@incitecpivot.com.au",
      "david.allen@incitecpivot.com.au",
      "kelvin.ulett@incitecpivot.com.au",
      "rob.carapellotti@incitecpivot.com.au",
      "tim.land@incitecpivot.com.au",
      "ashley.bels@incitecpivot.com.au",
      "ovin.bandaranaike@incitecpivot.com.au",
      "glen.edwards@incitecpivot.com.au",
      "luke.costigan@incitecpivot.com.au",
      "aaron.hulley@incitecpivot.com.au",
      "james.graham@incitecpivot.com.au",
      "ty.morrison@incitecpivot.com.au",
      "georgie.keating@incitecpivot.com.au",
      "rodney.pool@incitecpivot.com.au",
      "john.rowbotham@incitecpivot.com.au",
      "jade.cook@incitecpivot.com.au",
      "greg.crabb@incitecpivot.com.au",
      "adrian.howell@incitecpivot.com.au",
      "brendon.cox@incitecpivot.com.au",
      "jamal.labelak@incitecpivot.com.au",
      "shane.wiggett@incitecpivot.com.au",
      "liam.rains@incitecpivot.com.au",
      "donnavan.dippenaar@incitecpivot.com.au",
    ],
    "Mineral Acid": [
      "dan.kelleher@incitecpivot.com.au",
      "michael.soper@incitecpivot.com.au",
      "jessica.nieto@incitecpivot.com.au",
      "michael.giesen@incitecpivot.com.au",
      "bill.anderson@incitecpivot.com.au",
      "scott.dittman@incitecpivot.com.au",
      "dale.kelvin@incitecpivot.com.au",
      "leigh.clark@incitecpivot.com.au",
      "chris.scott@incitecpivot.com.au",
      "ashley.bels@incitecpivot.com.au",
      "almerindo.lana@incitecpivot.com.au",
      "michael.martini@incitecpivot.com.au",
      "jacob.young@incitecpivot.com.au",
      "donnavan.dippenaar@incitecpivot.com.au",
      "bradley.warhurst@incitecpivot.com.au",
      "peter.movigliatti@incitecpivot.com.au",
      "liam.rains@incitecpivot.com.au",
    ],
    "Power Station & Utilities": [
      "dan.kelleher@incitecpivot.com.au",
      "michael.soper@incitecpivot.com.au",
      "jessica.nieto@incitecpivot.com.au",
      "michael.giesen@incitecpivot.com.au",
      "luke.berry@incitecpivot.com.au",
      "rob.d'addona@incitecpivot.com.au",
      "barry.coonan@incitecpivot.com.au",
      "mark.espig@incitecpivot.com.au",
      "haydn.henning@incitecpivot.com.au",
      "ben.gorizia@incitecpivot.com.au",
      "jonathan.barra@incitecpivot.com.au",
      "robert.rose@incitecpivot.com.au",
      "zia.muhammad@incitecpivot.com.au",
    ],
  },
  discipline: {
    EIC: [
      "dan.kelleher@incitecpivot.com.au",
      "michael.martini@incitecpivot.com.au",
      "barry.coonan@incitecpivot.com.au",
      "michael.soper@incitecpivot.com.au",
      "jessica.nieto@incitecpivot.com.au",
      "michael.giesen@incitecpivot.com.au",
      "simon.kienzner@incitecpivot.com.au",
      "tony.barra@incitecpivot.com.au",
      "john.ryan@incitecpivot.com.au",
      "darren.borellini@incitecpivot.com.au",
      "terry.newman@incitecpivot.com.au",
      "ben.frost@incitecpivot.com.au",
      "grant.godkin@incitecpivot.com.au",
      "mark.espig@incitecpivot.com.au",
      "robert.coaker@incitecpivot.com.au",
      "craig.baade@incitecpivot.com.au",
      "nigel.reidy@incitecpivot.com.au",
      "henry.mann-carthey@incitecpivot.com.au",
    ],
    HSE: [
      "dan.kelleher@incitecpivot.com.au",
      "michael.soper@incitecpivot.com.au",
      "jessica.nieto@incitecpivot.com.au",
      "michael.giesen@incitecpivot.com.au",
      "zoe.chesters@incitecpivot.com.au",
      "shane.slegers@incitecpivot.com.au",
      "barry.coonan@incitecpivot.com.au",
      "francene.ellingworth@incitecpivot.com.au",
      "karen.cribb@incitecpivot.com.au",
      "robert.allan@incitecpivot.com.au",
      "evangelos.georgiou@incitecpivot.com.au",
      "james.laramey@incitecpivot.com.au",
      "amy.taylor@incitecpivot.com.au",
      "heidi.case@incitecpivot.com.au",
    ],
    Rotating: [
      "dan.kelleher@incitecpivot.com.au",
      "michael.soper@incitecpivot.com.au",
      "jessica.nieto@incitecpivot.com.au",
      "michael.giesen@incitecpivot.com.au",
      "michael.martini@incitecpivot.com.au",
      "sunil.goyal@incitecpivot.com.au",
      "benjamin.neuhaus@incitecpivot.com.au",
      "barry.coonan@incitecpivot.com.au",
      "ryan.rains@incitecpivot.com.au",
      "jonathan.barra@incitecpivot.com.au",
      "mariah.sproull@incitecpivot.com.au",
      "zia.muhammad@incitecpivot.com.au",
      "robert.rose@incitecpivot.com.au",
    ],
    Static: [
      "dan.kelleher@incitecpivot.com.au",
      "michael.soper@incitecpivot.com.au",
      "jessica.nieto@incitecpivot.com.au",
      "michael.giesen@incitecpivot.com.au",
      "michael.martini@incitecpivot.com.au",
      "rahat.hussain@incitecpivot.com.au",
      "desmond.thomson@incitecpivot.com.au",
      "wayne.oram@incitecpivot.com.au",
      "clarence.vanderwalt@incitecpivot.com.au",
      "barry.coonan@incitecpivot.com.au",
      "gavin.palmer@incitecpivot.com.au",
      "jonathan.barra@incitecpivot.com.au",
      "ryan.rains@incitecpivot.com.au",
      "mariah.sproull@incitecpivot.com.au",
      "naeem.kheirkhah@incitecpivot.com.au",
      "makarand.ingavale@dynonobel.com",
      "zia.muhammad@incitecpivot.com.au",
      "robert.rose@incitecpivot.com.au",
    ],
  },
} as const;

// Map raw plant keys to enum-friendly values in DB
const PLANT_KEY_MAP: Record<string, typeof schema.plantEnum.enumValues[number]> = {
  "Ammonia & Laboratory": "Ammonia & Laboratory",
  "Camp & Aviation": "Camp",
  "Granulation & Material Handling": "Granulation",
  "Mineral Acid": "Mineral Acid",
  "Power Station & Utilities": "Power & Utilities",
};

export async function POST() {
  try {
    // Build a map of email -> { plants: Set<string>, disciplines: Set<string> }
    const collector: Record<string, { plants: Set<string>; disciplines: Set<string> }> = {};

    for (const [rawPlant, emails] of Object.entries(RAW_RECIPIENT_DATA.plant)) {
      const plant = PLANT_KEY_MAP[rawPlant] ?? rawPlant;
      emails.forEach((email) => {
        if (!collector[email]) {
          collector[email] = { plants: new Set(), disciplines: new Set() };
        }
        collector[email].plants.add(plant);
      });
    }

    for (const [discipline, emails] of Object.entries(RAW_RECIPIENT_DATA.discipline)) {
      emails.forEach((email) => {
        if (!collector[email]) {
          collector[email] = { plants: new Set(), disciplines: new Set() };
        }
        collector[email].disciplines.add(discipline);
      });
    }

    let inserted = 0;
    let updated = 0;

    for (const [email, { plants, disciplines }] of Object.entries(collector)) {
      // Check if recipient exists
      const existing = await db
        .select()
        .from(schema.emailRecipients)
        .where(eq(schema.emailRecipients.email, email));

      const plantArr = Array.from(plants) as typeof schema.plantEnum.enumValues[] | undefined;
      const discArr = Array.from(disciplines) as typeof schema.disciplineEnum.enumValues[] | undefined;

      if (existing.length === 0) {
        await db.insert(schema.emailRecipients).values({
          email,
          plants: plantArr,
          disciplines: discArr,
        });
        inserted++;
      } else {
        const current = existing[0];
        // Merge arrays (avoid duplicates)
        const mergedPlants = Array.from(new Set([...(current.plants ?? []), ...plantArr]));
        const mergedDisc = Array.from(new Set([...(current.disciplines ?? []), ...discArr]));

        await db
          .update(schema.emailRecipients)
          .set({ plants: mergedPlants, disciplines: mergedDisc, updatedAt: new Date() })
          .where(eq(schema.emailRecipients.id, current.id));
        updated++;
      }
    }

    return NextResponse.json({ inserted, updated });
  } catch (err: any) {
    console.error("Bulk import recipients failed:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 