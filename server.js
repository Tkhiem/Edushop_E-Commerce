// ...existing code...
import reviewsRouter from "./routes/reviews.js";

// ...existing code...

// Routes
app.use("/api/courses", coursesRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/reviews", reviewsRouter); // ✅ Add this line

// ...existing code...
