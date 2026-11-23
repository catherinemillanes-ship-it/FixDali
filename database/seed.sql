USE fixdali;

INSERT INTO users (name,email,phone,password_hash,role) VALUES
('Ashley Reyes','ashley@fixdali.test','09171234567','$2y$10$oDEMNAlZnL8UOI.DOEYfOuWzznjW1FhV3wOKVeR2OCJjg47GjSMJS','user'),
('Admin','admin@dali.test','0000000000','$2y$10$rsvZDYWY6H/h11YQaEjXx.Z5W0QRkinfqWOZIdnuju0OPnT58wgCC','admin');

INSERT INTO technicians (name,cat,bio,avatar,rating,reviews,price,jobs,exp,available,verified) VALUES
('Juan Dela Cruz','plumbing','Licensed plumber specializing in leak repair, pipe installation and water heater servicing.','assets/images/898243919_1144357628051847_6388726759784974267_n.jpg',4.9,128,450,340,'8 yrs',1,1),
('Maria Santos','electrical','Certified electrician. Residential wiring, panel upgrades and lighting installation.','assets/images/898243919_4493841000903465_4594618448253981268_n.jpg',4.8,96,500,210,'6 yrs',1,1),
('Pedro Reyes','carpentry','Custom furniture, cabinet making and general woodwork.','assets/images/899053385_2137317957173952_2617789889343872339_n.jpg',4.7,74,400,185,'10 yrs',0,1),
('Ana Lim','painting','Interior/exterior painting, wallpaper and texture finishing.','assets/images/899127869_1150034737748372_6581773839887025553_n.jpg',4.9,112,350,260,'5 yrs',1,1),
('Carlos Tan','ac','AC cleaning, installation and repair for split and window units.','assets/images/899818042_2137048940259708_5123763752151035091_n.jpg',4.6,63,600,140,'7 yrs',1,0),
('Liza Gomez','cleaning','Deep cleaning, move-in/out cleaning and sanitation services.','assets/images/900598403_1660812525687878_6814546492302812790_n.jpg',4.8,88,300,320,'4 yrs',1,1),
('Mark Villanueva','appliance','Washing machine, refrigerator and oven repair.','assets/images/902171438_2171190690436659_853088382425926450_n.jpg',4.5,51,450,175,'9 yrs',1,1),
('Rosa Mendoza','pest','Termite treatment, general pest control and fumigation.','assets/images/902368130_1525083382780082_3312790790228685460_n.jpg',4.7,44,550,98,'6 yrs',0,1);