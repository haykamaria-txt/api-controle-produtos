function show(request, response) {
  return response.json({ status: "ok" });
}

module.exports = {
  show,
};
