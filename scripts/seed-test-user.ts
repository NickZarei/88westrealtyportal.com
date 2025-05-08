import dbConnect from "@/lib/dbConnect";
import { hashPassword } from "@/lib/hash";
import User from "@/models/User";

async function seedUser() {
  await dbConnect();

  const existing = await User.findOne({ username: "testagent" });
  if (existing) {
    console.log("✅ Test user already exists");
    return;
  }

  const hashed = await hashPassword("test1234");

  await User.create({
    firstName: "Test",
    lastName: "Agent",
    email: "test@88west.com",
    username: "testagent",
    phone: "123-456-7890",
    password: hashed,
    role: "agent",
    createdAt: new Date(),
  });

  console.log("✅ Test user created");
}

seedUser().then(() => process.exit());
