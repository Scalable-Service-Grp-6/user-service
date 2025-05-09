import app from "./app";

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// interServiceComs.listen(process.env.INTERSERVICES_PORT, () => {
//     console.log(`Inter-service communication server is running on port ${process.env.INTERSERVICES_PORT}`);
// });
