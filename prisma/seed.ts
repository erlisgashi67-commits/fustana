import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth";

async function main() {
  console.log("🌱 Seeding Fustana database...");

  // --- Admin user ---
  const adminEmail = "admin@fustana.al";
  const existingAdmin = await db.admin.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await db.admin.create({
      data: {
        email: adminEmail,
        name: "Admin Fustana",
        passwordHash: hashPassword("admin123"),
      },
    });
    console.log("✅ Created admin: admin@fustana.al / admin123");
  } else {
    console.log("ℹ️  Admin already exists");
  }

  // --- Products ---
  const products = [
    {
      title: "Fustana Mbrëmjeje Aurora",
      description:
        "Fustana mbrëmjeje i gjatë me detaje të qëndisura me dore. Material pëlhure të butë që rrjedh natyrshëm. Përshtatshëm për eventet e mbrëmjes dhe galat.",
      price: 18900,
      compareAtPrice: 24000,
      category: "Fustana Mbrëmjeje",
      sizes: ["XS", "S", "M", "L"],
      colors: ["E zezë", "Bordeaux", "Vjollcë"],
      images: [
        "https://sfile.chatglm.cn/images-ppt/745075c8c479.jpg",
        "https://sfile.chatglm.cn/images-ppt/b6cf226cfb15.jpg",
      ],
      featured: true,
      rating: 5,
    },
    {
      title: "Fustana Mbrëmjeje Noir",
      description:
        "Fustana elegant i zi me prerje moderne dhe fund të hapur. Shton një prekje sofistikimi për çdo mbrëmje të veçantë.",
      price: 15500,
      compareAtPrice: null,
      category: "Fustana Mbrëmjeje",
      sizes: ["S", "M", "L", "XL"],
      colors: ["E zezë"],
      images: ["https://sfile.chatglm.cn/images-ppt/4a3431689e68.jpg"],
      featured: false,
      rating: 4.5,
    },
    {
      title: "Fustana Mbrëmjeje Stella",
      description:
        "Fustana mbrëmjeje me ndriçim delikat dhe prerje asnjanëse. Dizajn që thekson siluetën me elegancë të paharrueshme.",
      price: 22000,
      compareAtPrice: 28000,
      category: "Fustana Mbrëmjeje",
      sizes: ["XS", "S", "M", "L"],
      colors: ["Argjend", "E zezë"],
      images: ["https://sfile.chatglm.cn/images-ppt/91c916a16ad9.jpg"],
      featured: true,
      rating: 5,
    },
    {
      title: "Fustana Dasme Bianca",
      description:
        "Fustana dasme klasik i bardhë me detale nusërie dhe bisht të gjatë. Punuar me kujdes për ditën më të rëndësishme të jetës suaj.",
      price: 45000,
      compareAtPrice: 55000,
      category: "Fustana Dasme",
      sizes: ["S", "M", "L"],
      colors: ["Bardhë", "Fildish"],
      images: [
        "https://sfile.chatglm.cn/images-ppt/a3da37c166ef.jpg",
        "https://sfile.chatglm.cn/images-ppt/fd776bf348ac.jpg",
      ],
      featured: true,
      rating: 5,
    },
    {
      title: "Fustana Dasme Celeste",
      description:
        "Fustana dasme me korzet dhe fund voluminoz. Dizajn romantik me detale të hapura që të bëjnë të ndihesh si princeshë.",
      price: 38000,
      compareAtPrice: null,
      category: "Fustana Dasme",
      sizes: ["XS", "S", "M", "L"],
      colors: ["Bardhë", "Rozë e hapur"],
      images: ["https://sfile.chatglm.cn/images-ppt/e1045f9e7551.jpg"],
      featured: false,
      rating: 4.5,
    },
    {
      title: "Fustana Dasme Rosalie",
      description:
        "Fustana dasme luksoz me dantellë të qëndisur dhe bisht dramatik. Për nusen që dëshiron një hyrje të paharrueshme.",
      price: 52000,
      compareAtPrice: 62000,
      category: "Fustana Dasme",
      sizes: ["S", "M", "L"],
      colors: ["Bardhë"],
      images: ["https://sfile.chatglm.cn/images-ppt/f524f2810af5.jpg"],
      featured: true,
      rating: 5,
    },
    {
      title: "Fustana Kokteile Mini Rose",
      description:
        "Fustana kokteile i shkurtër me tone rozë dhe prerje flirtuese. Ideal për festa dhe mbledhje miqësore.",
      price: 9900,
      compareAtPrice: 13000,
      category: "Fustana Kokteile",
      sizes: ["XS", "S", "M", "L"],
      colors: ["Rozë", "E kuqe"],
      images: [
        "https://sfile.chatglm.cn/images-ppt/ac765dd8c427.jpg",
        "https://sfile.chatglm.cn/images-ppt/50b2959ccd56.jpg",
      ],
      featured: true,
      rating: 4.5,
    },
    {
      title: "Fustana Kokteile Cherie",
      description:
        "Fustana kokteile me njësupër dhe detale të sofistikuara. Për një pamje moderne dhe të vetëbesueshme.",
      price: 11500,
      compareAtPrice: null,
      category: "Fustana Kokteile",
      sizes: ["S", "M", "L"],
      colors: ["E zezë", "Blu marine"],
      images: ["https://sfile.chatglm.cn/images-ppt/d7d20d80ab89.jpg"],
      featured: false,
      rating: 4.5,
    },
    {
      title: "Fustana Kokteile Bella",
      description:
        "Fustana kokteile elegant me bel të theksuar dhe fund të valëvizur. Rehati dhe stil në një kombinim perfekt.",
      price: 8900,
      compareAtPrice: 11000,
      category: "Fustana Kokteile",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Rozë", "Bardhë"],
      images: ["https://sfile.chatglm.cn/images-ppt/4118bd160648.jpg"],
      featured: false,
      rating: 5,
    },
  ];

  await db.product.deleteMany({});
  for (const p of products) {
    await db.product.create({
      data: {
        title: p.title,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        category: p.category,
        sizes: JSON.stringify(p.sizes),
        colors: JSON.stringify(p.colors),
        images: JSON.stringify(p.images),
        featured: p.featured,
        inStock: true,
        rating: p.rating,
      },
    });
  }
  console.log(`✅ Created ${products.length} products`);

  // --- Sample orders ---
  await db.order.deleteMany({});
  const allProducts = await db.product.findMany();
  const img = (p: { images: string }) => {
    try {
      return JSON.parse(p.images)?.[0] ?? "";
    } catch {
      return "";
    }
  };
  const sampleOrders = [
    {
      firstName: "Era",
      lastName: "Hoxha",
      phone: "+355 69 234 5678",
      email: "era.hoxha@example.com",
      address: "Rruga Myslym Shyri, Pallati 12, Ap. 5",
      city: "Tiranë",
      notes: "Ju lutem dërgoni pas orës 17:00.",
      status: "Në Pritje",
      items: [
        { productId: allProducts[0].id, title: allProducts[0].title, price: 18900, qty: 1, size: "M", color: "Bordeaux", image: img(allProducts[0]) },
        { productId: allProducts[6].id, title: allProducts[6].title, price: 9900, qty: 1, size: "S", color: "Rozë", image: img(allProducts[6]) },
      ],
    },
    {
      firstName: "Arta",
      lastName: "Krasniqi",
      phone: "+355 68 112 3344",
      email: "arta.k@example.com",
      address: "Bulevardi Dëshmorët, Nr. 45",
      city: "Durrës",
      notes: "",
      status: "Dërguar",
      items: [
        { productId: allProducts[3].id, title: allProducts[3].title, price: 45000, qty: 1, size: "M", color: "Bardhë", image: img(allProducts[3]) },
      ],
    },
    {
      firstName: "Klea",
      lastName: "Berisha",
      phone: "+355 67 998 7766",
      email: "klea.b@example.com",
      address: "Rruga Sami Frashëri, Nr. 8",
      city: "Vlorë",
      notes: "Dhurata - paketa të bukur.",
      status: "Përfunduar",
      items: [
        { productId: allProducts[8].id, title: allProducts[8].title, price: 8900, qty: 2, size: "M", color: "Rozë", image: img(allProducts[8]) },
      ],
    },
  ];

  for (const o of sampleOrders) {
    const subtotal = o.items.reduce((s, it) => s + it.price * it.qty, 0);
    const shipping = subtotal > 20000 ? 0 : 500;
    const orderNumber = `FS-${Math.random().toString(36).toUpperCase().slice(2, 7)}${Date.now().toString(36).toUpperCase().slice(-3)}`;
    await db.order.create({
      data: {
        orderNumber,
        firstName: o.firstName,
        lastName: o.lastName,
        phone: o.phone,
        email: o.email,
        address: o.address,
        city: o.city,
        notes: o.notes,
        status: o.status,
        items: JSON.stringify(o.items),
        subtotal,
        shipping,
        total: subtotal + shipping,
        paymentMethod: "Para në dorë",
      },
    });
  }
  console.log(`✅ Created ${sampleOrders.length} sample orders`);

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
