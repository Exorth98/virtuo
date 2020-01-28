'use strict';

//list of cars
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const cars = [{
  'id': 'a9c1b91b-5e3d-4cec-a3cb-ef7eebb4892e',
  'name': 'fiat-500-x',
  'pricePerDay': 36,
  'pricePerKm': 0.10
}, {
  'id': '697a943f-89f5-4a81-914d-ecefaa7784ed',
  'name': 'mercedes-class-a',
  'pricePerDay': 44,
  'pricePerKm': 0.30
}, {
  'id': '4afcc3a2-bbf4-44e8-b739-0179a6cd8b7d',
  'name': 'bmw-x1',
  'pricePerDay': 52,
  'pricePerKm': 0.45
}];

//list of current rentals
//useful for ALL steps
//the time is hour
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful for step 4
let rentals = [{
  'id': '893a04a3-e447-41fe-beec-9a6bfff6fdb4',
  'driver': {
    'firstName': 'Roman',
    'lastName': 'Frayssinet'
  },
  'carId': 'a9c1b91b-5e3d-4cec-a3cb-ef7eebb4892e',
  'pickupDate': '2020-01-02',
  'returnDate': '2020-01-02',
  'distance': 100,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'virtuo': 0
  }
}, {
  'id': 'bc16add4-9b1d-416c-b6e8-2d5103cade80',
  'driver': {
    'firstName': 'Redouane',
    'lastName': 'Bougheraba'
  },
  'carId': '697a943f-89f5-4a81-914d-ecefaa7784ed',
  'pickupDate': '2020-01-05',
  'returnDate': '2020-01-09',
  'distance': 300,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'virtuo': 0
  }
}, {
  'id': '8c1789c0-8e6a-48e3-8ee5-a6d4da682f2a',
  'driver': {
    'firstName': 'Fadily',
    'lastName': 'Camara'
  },
  'carId': '4afcc3a2-bbf4-44e8-b739-0179a6cd8b7d',
  'pickupDate': '2019-12-01',
  'returnDate': '2019-12-15',
  'distance': 1000,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'virtuo': 0
  }
}];

//list of actors for payment
//useful from step 5
let actors = [{
  'rentalId': '893a04a3-e447-41fe-beec-9a6bfff6fdb4',
  'payment': [{
    'who': 'driver',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'partner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'virtuo',
    'type': 'credit',
    'amount': 0
  }]
},{
  'rentalId': 'bc16add4-9b1d-416c-b6e8-2d5103cade80',
  'payment': [{
    'who': 'driver',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'partner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'virtuo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'rentalId': '8c1789c0-8e6a-48e3-8ee5-a6d4da682f2a',
  'payment': [{
    'who': 'driver',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'partner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'virtuo',
    'type': 'credit',
    'amount': 0
  }]
}];

// Calcultate rental days from pickup and return dates
const calculateDays = rent => {
  const startDate = Date.parse(rent["pickupDate"]);
  const endDate = Date.parse(rent["returnDate"]);
  return ((((endDate - startDate) / 1000 ) / 3600) / 24) + 1;
}
// Return the car corresponding to a given id
const foundCar = id => {
  let ret = null
  cars.forEach(car=>{
    if(car["id"] === id){
      ret = car;
    }
  })
  return ret;
}

// Return the car corresponding to a given id
const foundRent = id => {
  let ret = null
  rentals.forEach(rent=>{
    if(rent["id"] === id){
      ret = rent;
    }
  })
  return ret;
}

// Apply duscount on a price depending of the rental time in days
const discountPrice = (price, days) => {
  if      (days>10) return price*0.5
  else if (days>4)  return price*0.7
  else if (days>1)  return price*0.9
  else              return price
}

// Update all prices of rentals
const calculatePrices = rentals => {
  rentals.forEach(rent => {

    const car = foundCar(rent["carId"]);
    let days = calculateDays(rent);
    let price = (car["pricePerDay"]*days) + (car["pricePerKm"]*rent["distance"]);

    price = discountPrice(price,days);
    rent["price"] = price;
  })
}

// Update all Commissions of rentals
const calculateCommissions = rentals => {
  rentals.forEach(rent => {
    let days = calculateDays(rent);
    let price = rent["price"];

    const commission = price*0.3;
    let insuranceCom = commission/2;
    let rest = insuranceCom - days;

    rent["commission"] = {
      "total" : commission,
      "insurance" : insuranceCom,
      "treasury" : days,
      "virtuo" : rest
    }
  })
}

// Update all prices with options
const calculateOptions = rentals => {
  rentals.forEach(rent => {
    let days = calculateDays(rent);
    if(rent["options"]["deductibleReduction"]){
      rent["price"] += days*4;
      rent["options"]["deductibleReductionAmount"] = days*4;
    }
  })
}

// generate payment object
const generatePayment = (who, type, amount) => {
  return {
    "who" : who,
    "type" : type,
    "amoount" : amount
  }
}

// Update actors
const updateActors = actors => {
  actors.forEach(actor => {

    const rent = foundRent(actor["rentalId"]);
    const deductibleReductionAmount = rent["options"]["deductibleReductionAmount"];
    let payments = []
    payments.push(generatePayment("driver","debit",rent["price"]));
    payments.push(generatePayment("partner","credit",rent["price"] - rent["commission"]["total"] - deductibleReductionAmount));
    payments.push(generatePayment("insurance","credit",rent["commission"]["insurance"]));
    payments.push(generatePayment("treasury","credit",rent["commission"]["insurance"]));
    payments.push(generatePayment("virtuo","credit",rent["commission"]["virtuo"] + deductibleReductionAmount));

    actor["payment"] = payments;
  })
}


// Step 1 and 2
calculatePrices(rentals);
// Step 3
calculateCommissions(rentals);
// Step 4
calculateOptions(rentals);
// Step 5
updateActors(actors);

// console.log(cars);
console.log(rentals);
// console.log(actors);
