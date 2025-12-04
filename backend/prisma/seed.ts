import { prisma } from "src/lib/prisma.js";

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Seed de categorias
  const categories = [
    { name: "Alimentação", webDeviceIcon: "Utensils" },
    { name: "Transporte", webDeviceIcon: "Car" },
    { name: "Moradia", webDeviceIcon: "Home" },
    { name: "Saúde", webDeviceIcon: "Heart" },
    { name: "Educação", webDeviceIcon: "GraduationCap" },
    { name: "Lazer", webDeviceIcon: "Gamepad2" },
    { name: "Compras", webDeviceIcon: "ShoppingCart" },
    { name: "Vestuário", webDeviceIcon: "Shirt" },
    { name: "Beleza", webDeviceIcon: "Sparkles" },
    { name: "Contas", webDeviceIcon: "FileText" },
    { name: "Salário", webDeviceIcon: "DollarSign" },
    { name: "Investimentos", webDeviceIcon: "TrendingUp" },
    { name: "Assinaturas", webDeviceIcon: "CreditCard" },
    { name: "Viagens", webDeviceIcon: "Plane" },
    { name: "Outros", webDeviceIcon: "MoreHorizontal" },
  ];

  console.log("📦 Criando categorias...");
  for (const category of categories) {
    await prisma.categories.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log("✅ Seed concluído com sucesso!");
  console.log(`   - ${categories.length} categorias criadas`);
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
