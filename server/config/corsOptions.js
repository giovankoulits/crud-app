const corsOptions = {
  origin: ["http://127.0.0.1:5500", "http://127.0.0.1:3000"],
  credentials: true,
  methods: ["GET", "POST"],
};

module.exports = corsOptions;
