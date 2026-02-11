import { City } from "@/entities/City";
import { Country } from "@/entities/Country";
import { Film } from "@/entities/Film";
import { ActorRepo } from "@/repositories/ActorRepo";
import { AddressRepo } from "@/repositories/AddressRepo";
import { CategoryRepo } from "@/repositories/CategoryRepo";
import { CityRepo } from "@/repositories/CityRepo";
import { CountryRepo } from "@/repositories/CountryRepo";
import { FilmRepo } from "@/repositories/FilmRepo";
import { InventoryRepo } from "@/repositories/InventoryRepo";
import { StoreRepo } from "@/repositories/StoreRepo";
import { CustomerService } from "@/services/CustomerService";
import { PaymentService } from "@/services/PaymentService";
import { RentalService } from "@/services/RentalService";
import { StaffService } from "@/services/StaffService";



export async function seed(
  customerService: CustomerService,
  paymentService: PaymentService,
  rentalService: RentalService,
  staffService: StaffService,
  countryRepo: CountryRepo,
  cityRepo: CityRepo,
  addressRepo: AddressRepo,
  storeRepo: StoreRepo,
  inventoryRepo: InventoryRepo,
  filmRepo: FilmRepo,
  categoryRepo: CategoryRepo,
  actorRepo: ActorRepo
) {
  // Seed countries, cities, addresses, stores, films, inventory, staff, customers, rentals, payments
  // This is just an example and should be expanded with more realistic data

  // Seed countries
  const coutries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Japan",
    "China",
    "Brazil",
    "Mexico",
    "India",
    "Russia",
    "South Africa",
    "New Zealand",
    "Netherlands",
    "Sweden",
    "Norway",
    "Denmark"
  ].map(name => new Country(name));

  for (const country of coutries) {
    const createdCountry = await countryRepo.create(country);
    country.id = createdCountry.id; 
  }

  // Seed cities
  const cities = [
    { name: "New York", countryName: "United States" },
    { name: "Los Angeles", countryName: "United States" },
    { name: "Toronto", countryName: "Canada" },
    { name: "Vancouver", countryName: "Canada" },
    { name: "London", countryName: "United Kingdom" },
    { name: "Manchester", countryName: "United Kingdom" },
    { name: "Sydney", countryName: "Australia" },
    { name: "Melbourne", countryName: "Australia" },
    { name: "Berlin", countryName: "Germany" },
    { name: "Munich", countryName: "Germany" },
    { name: "Paris", countryName: "France" },
    { name: "Lyon", countryName: "France" },
    { name: "Rome", countryName: "Italy" },
    { name: "Milan", countryName: "Italy" },
    { name: "Madrid", countryName: "Spain" },
    { name: "Barcelona", countryName: "Spain" },
    { name: "Tokyo", countryName: "Japan" },
    { name: "Osaka", countryName: "Japan" },
    { name: "Beijing", countryName: "China" },
    { name: "Shanghai", countryName: "China" },
    { name: "Rio de Janeiro", countryName: "Brazil" },
    { name: "São Paulo", countryName: "Brazil" },
    { name: "Mexico City", countryName: "Mexico" },
    { name: "Guadalajara", countryName: "Mexico" },
    { name: "Mumbai", countryName: "India" },
    { name: "Delhi", countryName: "India" },
    { name: "Moscow", countryName: "Russia" },
    { name: "Saint Petersburg", countryName: "Russia" },
    { name: "Cape Town", countryName: "South Africa" },
    { name: "Johannesburg", countryName: "South Africa" },
    { name: "Auckland", countryName: "New Zealand" },
    { name: "Amsterdam", countryName: "Netherlands" },
    { name: "Rotterdam", countryName: "Netherlands" },
    { name: "Stockholm", countryName: "Sweden" },
    { name: "Gothenburg", countryName: "Sweden" },
    { name: "Oslo", countryName: "Norway" },
    { name: "Bergen", countryName: "Norway" },
    { name: "Copenhagen", countryName: "Denmark" },
    { name: "Aarhus", countryName: "Denmark" }
  ].map(c => {
    const country = coutries.find(country => country.name === c.countryName);
    if (!country) {
      throw new Error(`Country not found for city: ${c.name}`);
    }
    return new City(c.name, country.id!);
  });

  const createdCities = [];
  for (const city of cities) {
    const createdCity = await cityRepo.create({ city: city.city, country_id: city.country_id });
    createdCities.push({ ...city, id: createdCity.id });
  }

  // Seed category
  const categories = [
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Romance",
    "Sci-Fi",
    "Documentary",
    "Animation",
    "Thriller",
    "Fantasy"
  ];

  for (const name of categories) {
    await categoryRepo.create({ name });
  }

  // Seed actors
  const actors = [
    "Robert Downey Jr.",
    "Scarlett Johansson",
    "Chris Hemsworth",
    "Jennifer Lawrence",
    "Leonardo DiCaprio",
    "Emma Stone",
    "Tom Hanks",
    "Natalie Portman",
    "Brad Pitt",
    "Angelina Jolie",
    "Morgan Freeman",
    "Meryl Streep",
    "Johnny Depp",
    "Anne Hathaway",
    "Will Smith",
    "Charlize Theron",
    "Denzel Washington",
    "Kate Winslet",
    "Matt Damon",
    "Sandra Bullock",
    "Hugh Jackman",
    "Julia Roberts",
    "Christian Bale",
    "Nicole Kidman",
    "Samuel L. Jackson",
    "Amy Adams",
    "Mark Wahlberg",
    "Reese Witherspoon",
    "George Clooney",
    "Salma Hayek",
    "Joaquin Phoenix",
    "Zoe Saldana",
    "Chris Evans",
    "Gal Gadot",
    "Ryan Reynolds",
    "Emily Blunt",
    "Jason Momoa",
    "Margot Robbie",
    "Channing Tatum",
    "Blake Lively",
    "Vin Diesel",
    "Lupita Nyong'o",
    "Daniel Craig",
    "Rosamund Pike",
    "Jake Gyllenhaal",
    "Brie Larson",
    "Idris Elba",
    "Emma Watson",
    "Tom Hardy",
    "Saoirse Ronan",
    "Michael B. Jordan",
    "Tessa Thompson",
    "Chris Pratt",
    "Gal Gadot",
    "Zac Efron",
    "Lily Collins"
  ];

  for (const name of actors) {
    await actorRepo.create({ first_name: name.split(" ")[0], last_name: name.split(" ")[1] });
  }

  // Seed Films
  const films = [
    { title: "The Shawshank Redemption", description: "Two imprisoned men bond over a number of years", release_year: 1994, length: 142, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "The Godfather", description: "The aging patriarch of an organized crime dynasty transfers control", release_year: 1972, length: 175, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "The Dark Knight", description: "Batman faces the Joker in an epic showdown", release_year: 2008, length: 152, rating: "PG-13", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 5 },
    { title: "Pulp Fiction", description: "Various interconnected stories of crime in Los Angeles", release_year: 1994, length: 154, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "Forrest Gump", description: "The life journey of a simple man with good intentions", release_year: 1994, length: 142, rating: "PG-13", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "Inception", description: "A thief enters dreams to plant ideas", release_year: 2010, length: 148, rating: "PG-13", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 5 },
    { title: "The Matrix", description: "A hacker discovers reality is a simulation", release_year: 1999, length: 136, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "Goodfellas", description: "The story of Henry Hill and his life in the mob", release_year: 1990, length: 146, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "The Silence of the Lambs", description: "FBI agent seeks help from imprisoned cannibal", release_year: 1991, length: 118, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "Saving Private Ryan", description: "Soldiers search for a paratrooper in WWII", release_year: 1998, length: 169, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "Jurassic Park", description: "Scientists clone dinosaurs for a theme park", release_year: 1993, length: 127, rating: "PG-13", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "Titanic", description: "A love story aboard the doomed ship", release_year: 1997, length: 194, rating: "PG-13", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 5 },
    { title: "Avatar", description: "Marine on an alien world joins native resistance", release_year: 2009, length: 162, rating: "PG-13", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 5 },
    { title: "The Avengers", description: "Earth's mightiest heroes unite against threats", release_year: 2012, length: 143, rating: "PG-13", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 5 },
    { title: "Star Wars", description: "A young farm boy joins the rebellion", release_year: 1977, length: 121, rating: "PG", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "The Lord of the Rings", description: "A hobbit must destroy a powerful ring", release_year: 2001, length: 178, rating: "PG-13", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 5 },
    { title: "Gladiator", description: "A betrayed general seeks revenge in the arena", release_year: 2000, length: 155, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "The Departed", description: "Undercover cops in mob and police", release_year: 2006, length: 151, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "Back to the Future", description: "Teen travels back in time in a DeLorean", release_year: 1985, length: 116, rating: "PG", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "The Lion King", description: "Young lion prince reclaims his kingdom", release_year: 1994, length: 88, rating: "G", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 7 },
    { title: "The Green Mile", description: "Death row guard witnesses supernatural events", release_year: 1999, length: 189, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "Interstellar", description: "Astronauts search for new home for humanity", release_year: 2014, length: 169, rating: "PG-13", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 5 },
    { title: "The Prestige", description: "Rival magicians engage in dangerous competition", release_year: 2006, length: 130, rating: "PG-13", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "The Usual Suspects", description: "Criminals brought together for a heist", release_year: 1995, length: 106, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "Se7en", description: "Detectives hunt a serial killer using seven deadly sins", release_year: 1995, length: 127, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "The Truman Show", description: "Man discovers his life is a TV show", release_year: 1998, length: 103, rating: "PG", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "Memento", description: "Man with short-term memory loss hunts killer", release_year: 2000, length: 113, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "The Sixth Sense", description: "Boy who can see ghosts seeks help", release_year: 1999, length: 107, rating: "PG-13", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "Finding Nemo", description: "Clownfish searches ocean for his lost son", release_year: 2003, length: 100, rating: "G", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 7 },
    { title: "Toy Story", description: "Toys come to life when humans aren't around", release_year: 1995, length: 81, rating: "G", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 7 },
    { title: "Frozen", description: "Princess with ice powers flees her kingdom", release_year: 2013, length: 102, rating: "PG", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "The Social Network", description: "The founding of Facebook", release_year: 2010, length: 120, rating: "PG-13", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "Black Panther", description: "King returns home to lead his nation", release_year: 2018, length: 134, rating: "PG-13", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 5 },
    { title: "Joker", description: "Failed comedian descends into madness", release_year: 2019, length: 122, rating: "R", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 3 },
    { title: "Parasite", description: "Poor family schemes to infiltrate wealthy household", release_year: 2019, length: 132, rating: "R", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 3 },
    { title: "Mad Max: Fury Road", description: "Post-apocalyptic chase across wasteland", release_year: 2015, length: 120, rating: "R", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 3 },
    { title: "Guardians of the Galaxy", description: "Misfits team up to save the galaxy", release_year: 2014, length: 121, rating: "PG-13", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 5 },
    { title: "Deadpool", description: "Mercenary with regenerative powers seeks revenge", release_year: 2016, length: 108, rating: "R", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 3 },
    { title: "Spider-Man", description: "Teen gains spider powers and fights crime", release_year: 2002, length: 121, rating: "PG-13", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "Iron Man", description: "Billionaire builds powered armor suit", release_year: 2008, length: 126, rating: "PG-13", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "Captain America", description: "Soldier transformed into super-soldier", release_year: 2011, length: 124, rating: "PG-13", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "Thor", description: "Norse god banished to Earth", release_year: 2011, length: 115, rating: "PG-13", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "Wonder Woman", description: "Amazon warrior leaves island to fight in WWI", release_year: 2017, length: 141, rating: "PG-13", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 5 },
    { title: "Aquaman", description: "Half-human prince of Atlantis claims throne", release_year: 2018, length: 143, rating: "PG-13", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 5 },
    { title: "Doctor Strange", description: "Surgeon becomes master of mystic arts", release_year: 2016, length: 115, rating: "PG-13", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 5 },
    { title: "Ant-Man", description: "Thief gains ability to shrink", release_year: 2015, length: 117, rating: "PG-13", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 5 },
    { title: "Logan", description: "Aging mutant on final mission", release_year: 2017, length: 137, rating: "R", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 3 },
    { title: "X-Men", description: "Mutants fight for peaceful coexistence", release_year: 2000, length: 104, rating: "PG-13", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "Shrek", description: "Ogre rescues princess from tower", release_year: 2001, length: 90, rating: "PG", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "Zootopia", description: "Rabbit cop and fox con artist solve case", release_year: 2016, length: 108, rating: "PG", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 5 },
    { title: "Coco", description: "Boy enters Land of the Dead during Día de Muertos", release_year: 2017, length: 105, rating: "PG", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 5 },
    { title: "Inside Out", description: "Emotions guide girl through life changes", release_year: 2015, length: 95, rating: "PG", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 5 },
    { title: "Up", description: "Elderly man flies house with balloons to South America", release_year: 2009, length: 96, rating: "PG", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "WALL-E", description: "Robot cleans Earth while humans live in space", release_year: 2008, length: 98, rating: "G", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 7 },
    { title: "Ratatouille", description: "Rat dreams of becoming French chef", release_year: 2007, length: 111, rating: "G", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 7 },
    { title: "The Incredibles", description: "Family of superheroes forced to hide powers", release_year: 2004, length: 115, rating: "PG", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "Monsters Inc", description: "Monsters generate power by scaring children", release_year: 2001, length: 92, rating: "G", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 7 },
    { title: "Cars", description: "Race car stranded in small town", release_year: 2006, length: 117, rating: "G", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 7 },
    { title: "Brave", description: "Scottish princess defies tradition", release_year: 2012, length: 93, rating: "PG", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "Moana", description: "Polynesian girl sails to save her island", release_year: 2016, length: 107, rating: "PG", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 5 },
    { title: "Tangled", description: "Long-haired princess escapes tower", release_year: 2010, length: 100, rating: "PG", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "Big Hero 6", description: "Boy and robot form superhero team", release_year: 2014, length: 102, rating: "PG", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 5 },
    { title: "Wreck-It Ralph", description: "Video game villain wants to be hero", release_year: 2012, length: 101, rating: "PG", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "Kung Fu Panda", description: "Clumsy panda becomes martial arts hero", release_year: 2008, length: 92, rating: "PG", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "How to Train Your Dragon", description: "Viking befriends dragon", release_year: 2010, length: 98, rating: "PG", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "Despicable Me", description: "Villain adopts three girls", release_year: 2010, length: 95, rating: "PG", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "The Lego Movie", description: "Ordinary Lego figure becomes hero", release_year: 2014, length: 100, rating: "PG", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 5 },
    { title: "Harry Potter", description: "Boy wizard attends magic school", release_year: 2001, length: 152, rating: "PG", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "The Hobbit", description: "Hobbit joins dwarves to reclaim homeland", release_year: 2012, length: 169, rating: "PG-13", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 5 },
    { title: "Pirates of the Caribbean", description: "Pirate and blacksmith rescue kidnapped woman", release_year: 2003, length: 143, rating: "PG-13", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "Indiana Jones", description: "Archaeologist searches for ancient artifacts", release_year: 1981, length: 115, rating: "PG", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "E.T.", description: "Boy befriends alien stranded on Earth", release_year: 1982, length: 115, rating: "PG", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "Jaws", description: "Giant shark terrorizes beach town", release_year: 1975, length: 124, rating: "PG", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "Alien", description: "Crew encounters deadly creature in space", release_year: 1979, length: 117, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "Terminator", description: "Cyborg sent back in time to kill woman", release_year: 1984, length: 107, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "Die Hard", description: "Cop fights terrorists in office building", release_year: 1988, length: 132, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "The Fifth Element", description: "Cab driver helps save Earth from evil", release_year: 1997, length: 126, rating: "PG-13", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "Blade Runner", description: "Cop hunts rogue androids in dystopian future", release_year: 1982, length: 117, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "The Thing", description: "Antarctic researchers battle shapeshifting alien", release_year: 1982, length: 109, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "Ghostbusters", description: "Scientists start ghost-catching business", release_year: 1984, length: 105, rating: "PG", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "Rocky", description: "Underdog boxer gets title shot", release_year: 1976, length: 120, rating: "PG", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "Scarface", description: "Cuban refugee becomes drug kingpin", release_year: 1983, length: 170, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "Casino", description: "Mob runs Las Vegas casino", release_year: 1995, length: 178, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "Heat", description: "Cop and criminal develop mutual respect", release_year: 1995, length: 170, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "The Big Lebowski", description: "Slacker mistaken for millionaire", release_year: 1998, length: 117, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "American Beauty", description: "Man has midlife crisis in suburbs", release_year: 1999, length: 122, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "A Beautiful Mind", description: "Mathematician struggles with schizophrenia", release_year: 2001, length: 135, rating: "PG-13", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 5 },
    { title: "The Pianist", description: "Jewish pianist survives Holocaust in Warsaw", release_year: 2002, length: 150, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "Braveheart", description: "Scottish warrior leads rebellion", release_year: 1995, length: 178, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "300", description: "Spartans defend pass against Persian army", release_year: 2006, length: 117, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "Troy", description: "Greek warriors besiege Troy for Helen", release_year: 2004, length: 163, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "Kingdom of Heaven", description: "Blacksmith becomes knight during Crusades", release_year: 2005, length: 144, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "The Last Samurai", description: "American soldier embraces samurai culture", release_year: 2003, length: 154, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "The Revenant", description: "Frontiersman survives bear attack seeks revenge", release_year: 2015, length: 156, rating: "R", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 3 },
    { title: "1917", description: "Soldiers race to deliver message in WWI", release_year: 2019, length: 119, rating: "R", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 3 },
    { title: "Dunkirk", description: "Allied evacuation from French beach in WWII", release_year: 2017, length: 106, rating: "PG-13", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 5 },
    { title: "Hacksaw Ridge", description: "Medic serves in WWII without weapon", release_year: 2016, length: 139, rating: "R", rental_rate: 3.99, replacement_cost: 24.99, rental_duration: 3 },
    { title: "Platoon", description: "Young soldier experiences Vietnam War", release_year: 1986, length: 120, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 },
    { title: "Apocalypse Now", description: "Officer sent to assassinate rogue colonel", release_year: 1979, length: 153, rating: "R", rental_rate: 2.99, replacement_cost: 19.99, rental_duration: 3 }
  ].map(f => new Film(f.title, f.rental_duration, f.replacement_cost, f.description, f.release_year, f.rental_rate, f.length, f.rating));

  const createdFilms = [];
  for (const film of films) {
    const created = await filmRepo.create(film);
    createdFilms.push({...created, id: created.id!});
  }

  // Seed addresses
  const addresses = [];
  for (let i = 0; i < 80; i++) {
    const city = createdCities[Math.floor(Math.random() * createdCities.length)];
    const streets = ["Main St", "Oak Ave", "Maple Dr", "Elm St", "Pine Rd", "Cedar Ln", "Washington Blvd", "Park Ave", "Broadway", "Market St", "Church St", "High St"];
    const address = `${Math.floor(Math.random() * 9000) + 1000} ${streets[Math.floor(Math.random() * streets.length)]}`;
    const phone = `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
    
    const created = await addressRepo.create({
      address,
      address2: Math.random() > 0.7 ? `Apt ${Math.floor(Math.random() * 500) + 1}` : undefined,
      district: ["Downtown", "Uptown", "Midtown", "East Side", "West Side", "North End", "South End"][Math.floor(Math.random() * 7)],
      city_id: city.id!,
      postal_code: `${Math.floor(Math.random() * 90000) + 10000}`,
      phone
    });
    addresses.push({...created, id: created.id!});
  }

  // Seed stores
  const stores = [];
  for (let i = 0; i < 8; i++) {
    const address = addresses[i];
    const store = await storeRepo.create({
      manager_staff_id: undefined, // Will update after creating staff
      address_id: address.id!
    });
    stores.push({...store, id: store.id!});
  }

  // Seed staff
  const staffMembers = [];
  const staffNames = [
    { first: "John", last: "Smith" },
    { first: "Sarah", last: "Johnson" },
    { first: "Michael", last: "Williams" },
    { first: "Emily", last: "Brown" },
    { first: "David", last: "Jones" },
    { first: "Jessica", last: "Garcia" },
    { first: "James", last: "Miller" },
    { first: "Ashley", last: "Davis" },
    { first: "Robert", last: "Rodriguez" },
    { first: "Amanda", last: "Martinez" },
    { first: "William", last: "Hernandez" },
    { first: "Melissa", last: "Lopez" },
    { first: "Christopher", last: "Gonzalez" },
    { first: "Jennifer", last: "Wilson" },
    { first: "Matthew", last: "Anderson" },
    { first: "Michelle", last: "Thomas" },
    { first: "Daniel", last: "Taylor" },
    { first: "Stephanie", last: "Moore" },
    { first: "Anthony", last: "Jackson" },
    { first: "Lisa", last: "Martin" },
    { first: "Kevin", last: "Lee" },
    { first: "Karen", last: "Perez" },
    { first: "Brian", last: "Thompson" },
    { first: "Nancy", last: "White" },
    { first: "Richard", last: "Harris" }
  ];

  for (let i = 0; i < staffNames.length; i++) {
    const name = staffNames[i];
    const address = addresses[8 + i];
    const store = stores[i % stores.length];
    
    const staff = await staffService.registerStaff({
      firstName: name.first,
      lastName: name.last,
      email: `${name.first.toLowerCase()}.${name.last.toLowerCase()}@dvdrental.com`,
      storeId: store.id!,
      username: `${name.first.toLowerCase()}${name.last.toLowerCase()}`,
      password: "password123",
      addressId: address.id!
    });
    staffMembers.push({ ...staff, id: staff.id! });
  }

  // Update stores with manager_staff_id
  for (let i = 0; i < stores.length; i++) {
    const store = stores[i];
    store.manager_staff_id = staffMembers[i].id;
    await storeRepo.update(store);
  }

  // Seed inventory (ensure each store has at least one copy of each film)
  const inventories = [];
  for (const film of createdFilms) {
    // Ensure each store gets at least one copy of the film
    for (const store of stores) {
      const inventory = await inventoryRepo.create({
        film_id: film.id!,
        store_id: store.id!
      });
      inventories.push({ ...inventory, id: inventory.id! });
    }

    // Distribute additional copies randomly across stores
    const additionalCopies = Math.floor(Math.random() * 5) + 2 - stores.length;
    for (let i = 0; i < additionalCopies; i++) {
      const store = stores[Math.floor(Math.random() * stores.length)];
      const inventory = await inventoryRepo.create({
        film_id: film.id!,
        store_id: store.id!
      });
      inventories.push({ ...inventory, id: inventory.id! });
    }
  }

  // Seed customers
  const customers = [];
  const firstNames = ["Emma", "Liam", "Olivia", "Noah", "Ava", "Elijah", "Sophia", "Lucas", "Isabella", "Mason", 
                      "Mia", "Logan", "Charlotte", "Oliver", "Amelia", "Ethan", "Harper", "Aiden", "Evelyn", "James",
                      "Abigail", "Benjamin", "Emily", "William", "Elizabeth", "Alexander", "Sofia", "Michael", "Avery", "Daniel",
                      "Ella", "Henry", "Madison", "Jackson", "Scarlett", "Sebastian", "Victoria", "Jack", "Aria", "Owen",
                      "Grace", "Samuel", "Chloe", "Matthew", "Camila", "Joseph", "Penelope", "Levi", "Riley", "David",
                      "Layla", "John", "Lillian", "Wyatt", "Nora", "Carter", "Zoey", "Julian", "Mila", "Luke",
                      "Aubrey", "Grayson", "Hannah", "Isaac", "Lily", "Jayden", "Addison", "Theodore", "Eleanor", "Gabriel",
                      "Natalie", "Anthony", "Luna", "Dylan", "Savannah", "Leo", "Brooklyn", "Lincoln", "Leah", "Jaxon"];
  
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
                     "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
                     "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
                     "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
                     "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"];

  for (let i = 0; i < 250; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const address = addresses[Math.floor(Math.random() * addresses.length)];
    const store = stores[Math.floor(Math.random() * stores.length)];
    
    const customer = await customerService.registerCustomer({
      firstName: firstName,
      lastName: lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
      addressId: address.id!,
      storeId: store.id!
    });
    customers.push({ ...customer, id: customer.id! });
  }

  // Seed rentals and payments
  const rentals = [];
  const payments = [];

  for (let i = 0; i < 600; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const film = createdFilms[Math.floor(Math.random() * createdFilms.length)];
    const staff = staffMembers[Math.floor(Math.random() * staffMembers.length)];
    const store = stores[Math.floor(Math.random() * stores.length)];

    // Check for available inventory before renting
    const availableInventories = await inventoryRepo.findAvailableByFilmAndStore(film.id!, store.id!);
    if (availableInventories.length === 0) {
      console.warn(`No available inventory for film ${film.id} in store ${store.id}. Skipping rental.`);
      continue;
    }

    const rental = await rentalService.rentFilm({
      customerId: customer.id!,
      filmId: film.id!,
      storeId: store.id!,
      staffId: staff.id!
    });
    rentals.push({ ...rental, id: rental.id! });

    const payment = await paymentService.processRentalPayment({
      rentalId: rental.id!,
      customerId: customer.id!,
      staffId: staff.id!,
    });
    payments.push({ ...payment, id: payment.id! });
  }

  console.log("✅ Database seeded successfully!");
  console.log(`📊 Summary:`);
  console.log(`   - Countries: ${coutries.length}`);
  console.log(`   - Cities: ${cities.length}`);
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - Actors: ${actors.length}`);
  console.log(`   - Films: ${createdFilms.length}`);
  console.log(`   - Addresses: ${addresses.length}`);
  console.log(`   - Stores: ${stores.length}`);
  console.log(`   - Staff: ${staffMembers.length}`);
  console.log(`   - Inventory: ${inventories.length}`);
  console.log(`   - Customers: ${customers.length}`);
  console.log(`   - Rentals: ${rentals.length}`);
  console.log(`   - Payments: ${payments.length}`);
}