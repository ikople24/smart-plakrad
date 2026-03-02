import dbConnect from "@/lib/dbConnect";
import Survey from "@/models/Survey";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 0;
      const skip = (page - 1) * limit;
      const sortField = req.query.sortField || "createdAt";
      const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

      let queryBuilder = Survey.find({})
        .sort({ [sortField]: sortOrder });

      if (limit > 0) {
        queryBuilder = queryBuilder.skip(skip).limit(limit);
      }

      const surveys = await queryBuilder;

      if (req.query.withCount === "true") {
        const total = await Survey.countDocuments({});
        return res.status(200).json({
          success: true,
          data: surveys,
          pagination: {
            page,
            limit,
            total,
            totalPages: limit > 0 ? Math.ceil(total / limit) : 1
          }
        });
      }

      return res.status(200).json(surveys);
    } catch (err) {
      console.error("Failed to fetch surveys:", err);
      return res.status(500).json({ success: false, error: "Failed to fetch surveys" });
    }
  } else {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
