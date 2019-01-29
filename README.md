# Ghost-Chess (Project Proposal from Theodo)
Developer: Chi Zhang, Wai Lee, Tim Cheuk, Hao Mang, Terrence Chan, Jian Rong(me). \n
This is the Software Engineering Group Project from the 1st Term of the 3rd year in Imperial College. We use React-Native to write a native app that can be used in both iOS/Android, use nodeJS to write the backend for sending commands to the Arduino Board and updating chess board, and compile and test using Expo. Using the app, it is able to control a Arduino Board, to move chess pieces on a magnetic chess board. So when a people controlling the client app, and move a piece, the movement will be reflected on the chess board.
The flow chart will be added later.
--CAVEAT--:
1. The chess board's size is pre-set(30cm x 30cm). So if using another chess board with different size, this won't work as expected. The parameter can either be changed from the backend where the command is being generated, or directly change the C-Like program for parsing and controlling the chessboard (this should be in xy-plotter folder) 
2. We use ngrok to forward port, in order to let remote user being able to control the board, but seems ngrok will change the address sometime(?). Purchase a premium version seems can solve the problem. However the time is limited so we don't bother to do this.
