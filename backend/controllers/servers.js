const Server = require("../models/server");

exports.createServer = (req, res, next) => {
  const server = new Server({
    name: req.body.name,
    store: req.body.store,
    creator: req.userData.userId
  });
  server
    .save()
    .then(createdServer => {
      res.status(201).json({
        message: "Server added successfully",
        server: {
          ...createdServer,
          id: createdServer._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a server failed!"
      });
    });
};

exports.updateServer = (req, res, next) => {
  const server = new Server({
    _id: req.body.id,
    name: req.body.name,
    store: req.body.store,
    creator: req.userData.userId
  });
  Server.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    server
  )
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't update server!"
      });
    });
};

exports.getServers = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const serverQuery = Server.find();
  let fetchedServers;
  if (pageSize && currentPage) {
    serverQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  serverQuery
    .then(documents => {
      fetchedServers = documents;
      return Server.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Reservations fetched successfully!",
        servers: fetchedServers,
        maxServers: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching reservations failed!"
      });
    });
};

exports.getServer = (req, res, next) => {
  Server.findById(req.params.id)
    .then(server => {
      if (server) {
        res.status(200).json(server);
      } else {
        res.status(404).json({ message: "Server not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching server failed!"
      });
    });
};

exports.deleteServer = (req, res, next) => {
  Server.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting server failed!"
      });
    });
};
