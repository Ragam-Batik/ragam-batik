const { createClient } = require('@supabase/supabase-js');

(async () => {
  const { nanoid } = await import('nanoid');

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const catalog = [
    {
      name: "Batik Parang Yogyakarta",
      provinsi: "Yogyakarta",
      description:
        "Batik Parang adalah salah satu motif batik tertua di Indonesia...",
      occasion: "Batik Parang cocok digunakan pada acara resmi...",
      history: "Motif Parang diciptakan pada masa kerajaan Mataram...",
      link_shop:
        "https://www.tokopedia.com/search?st=&q=batik%20parang%20yogyakarta",
      link_image:
        "",
    },
    // Tambahkan motif lainnya
  ];

  for (const motif of catalog) {
    const id = nanoid();

    const { data, error } = await supabase
      .from('motif_batik')
      .insert({
        id,
        name: motif.name,
        provinsi: motif.provinsi,
        description: motif.description,
        occasion: motif.occasion,
        history: motif.history,
        link_shop: motif.link_shop,
        link_image: motif.link_image,
      });

    if (error) {
      console.error('Insert error:', error);
    } else {
      console.log(`Inserted motif with id ${id}`);
    }
  }
})();
