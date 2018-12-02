const Reservation = require("../models/reservation");

exports.createReservation = (req, res, next) => {
  const reservation = new Reservation({
    name: req.body.name,
    size: req.body.size,
    phone: req.body.phone,
    notes: req.body.notes,
    creator: req.userData.userId
  });
  reservation
    .save()
    .then(createdReservation => {
      res.status(201).json({
        message: "Reservation added successfully",
        reservation: {
          ...createdReservation,
          id: createdReservation._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a reservation failed!"
      });
    });
};

exports.updateReservation = (req, res, next) => {
  const reservation = new Reservation({
    _id: req.body.id,
    name: req.body.name,
    size: req.body.size,
    phone: req.body.phone,
    notes: req.body.notes,
    creator: req.userData.userId
  });
  Reservation.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    reservation
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
        message: "Couldn't udpate reservation!"
      });
    });
};

exports.getReservations = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const reservationQuery = Reservation.find();
  let fetchedReservations;
  if (pageSize && currentPage) {
    reservationQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  reservationQuery
    .then(documents => {
      fetchedReservations = documents;
      return Reservation.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Reservations fetched successfully!",
        reservations: fetchedReservations,
        maxReservations: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching reservations failed!"
      });
    });
};

exports.getReservation = (req, res, next) => {
  Reservation.findById(req.params.id)
    .then(reservation => {
      if (reservation) {
        res.status(200).json(reservation);
      } else {
        res.status(404).json({ message: "Reservation not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching reservation failed!"
      });
    });
};

exports.deleteReservation = (req, res, next) => {
  Reservation.deleteOne({ _id: req.params.id, creator: req.userData.userId })
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
