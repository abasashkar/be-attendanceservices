const prisma = require("../config/prisma");
const redis = require("../config/redis");
const axios = require("axios");

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://auth-service:4001";

const CLASSES_ALL_CACHE_KEY = "classes:all:v2";

function buildClassSearchWhere(teacherId, search) {
  const base = teacherId ? { teacherId } : {};
  if (!search || typeof search !== "string" || !search.trim()) {
    return base;
  }
  const term = search.trim();
  return {
    ...base,
    OR: [
      { name: { contains: term, mode: "insensitive" } },
      { teacher: { name: { contains: term, mode: "insensitive" } } },
      { teacher: { email: { contains: term, mode: "insensitive" } } },
    ],
  };
}

exports.getAllClasses = async (search) => {
  const hasSearch = search && typeof search === "string" && search.trim();
  if (!hasSearch) {
    const cached = await redis.get(CLASSES_ALL_CACHE_KEY);
    if (cached) return JSON.parse(cached);
  }

  const where = buildClassSearchWhere(null, search);
  const classes = await prisma.class.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { teacher: true },
  });

  if (!hasSearch) {
    await redis.set(CLASSES_ALL_CACHE_KEY, JSON.stringify(classes), "EX", 1800);
  }
  return classes;
};

exports.getClassesByTeacher = async (teacherId, search) => {
  const hasSearch = search && typeof search === "string" && search.trim();
  if (!hasSearch) {
    const cacheKey = `classes:${teacherId}:v2`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
  }

  const where = buildClassSearchWhere(teacherId, search);
  const classes = await prisma.class.findMany({
    where,
    include: { teacher: true },
  });

  if (!hasSearch) {
    const cacheKey = `classes:${teacherId}:v2`;
    await redis.set(cacheKey, JSON.stringify(classes), "EX", 1800);
  }
  return classes;
};

/** Sync teacher from auth service if they exist there with TEACHER role */
async function ensureTeacherSynced(teacherId) {
  let teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
  });
  if (teacher) return teacher;

  try {
    const { data: user } = await axios.get(
      `${AUTH_SERVICE_URL}/internal/users/${teacherId}`,
      { timeout: 5000 }
    );
    if (!user || user.role !== "TEACHER") {
      const err = new Error("Teacher not found");
      err.code = "TEACHER_NOT_FOUND";
      throw err;
    }
    const name = user.email ? user.email.split("@")[0] : user.id;
    teacher = await prisma.teacher.upsert({
      where: { id: user.id },
      create: { id: user.id, name, email: user.email },
      update: { name, email: user.email },
    });
    return teacher;
  } catch (e) {
    if (e.code === "TEACHER_NOT_FOUND") throw e;
    if (e.response?.status === 404) {
      const err = new Error("Teacher not found");
      err.code = "TEACHER_NOT_FOUND";
      throw err;
    }
    console.error("Auth service lookup failed:", e.message);
    const err = new Error("Teacher not found");
    err.code = "TEACHER_NOT_FOUND";
    throw err;
  }
}

exports.createClass = async ({ name, teacherId }) => {
  await ensureTeacherSynced(teacherId);
  const newClass = await prisma.class.create({
    data: {
      name,
      teacherId,
    },
    include: { teacher: true },
  });
  await redis.del(CLASSES_ALL_CACHE_KEY);
  await redis.del(`classes:${teacherId}:v2`);
  return newClass;
};

