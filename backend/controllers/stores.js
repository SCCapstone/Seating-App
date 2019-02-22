const Store = require("../models/store");

exports.createStore = (req, res, next) => {
  const store = new Store({
    name: req.body.name,
    defaultFloorplan: req.body.defaultFloorplan,
    creator: req.userData.userId
  });
  store
    .save()
    .then(createdStore => {
      res.status(201).json({
        message: "Store added successfully",
        store: {
          ...createdStore,
          id: createdStore._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a store failed!"
      });
    });
};

exports.updateStore = (req, res, next) => {
  const store = new Store({
    _id: req.body.id,
    name: req.body.name,
    defaultFloorplan: req.body.defaultFloorplan,
    creator: req.userData.userId
  });
  Store.updateOne({ _id: req.params.id, creator: req.userData.userId }, store)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't update store!"
      });
    });
};

exports.getStores = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const storeQuery = Store.find();
  let fetchedStores;
  if (pageSize && currentPage) {
    storeQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  storeQuery
    .then(documents => {
      fetchedStores = documents;
      return Store.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Reservations fetched successfully!",
        stores: fetchedStores,
        maxStores: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching reservations failed!"
      });
    });
};

exports.getStore = (req, res, next) => {
  Store.findById(req.params.id)
    .then(store => {
      if (store) {
        res.status(200).json(store);
      } else {
        res.status(404).json({ message: "Store not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching store failed!"
      });
    });
};

exports.deleteStore = (req, res, next) => {
  Store.deleteOne({ _id: req.params.id, creator: req.userData.userId })
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
        message: "Deleting reservations failed!"
      });
    });
};
