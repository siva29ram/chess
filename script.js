document.addEventListener('DOMContentLoaded', function() {
    let draggedElement;
    let startSquare, startRow, startCol;
    let currentTurn = 'white'; // Start with white's turn


let hasWhiteKingMoved = false;
let hasWhiteRook1Moved = false; // Track the left rook (a1)
let hasWhiteRook2Moved = false; // Track the right rook (h1)
let hasBlackKingMoved = false;
let hasBlackRook1Moved = false; // Track the left rook (a8)
let hasBlackRook2Moved = false; // Track the right rook (h8)
    
    function dragStart(event) {
        draggedElement = event.target; 
        startSquare = draggedElement.parentElement;
        

        // Ensure correct identification of startRow and startCol
        startRow = Array.from(startSquare.parentElement.parentElement.children).indexOf(startSquare.parentElement);
        startCol = Array.from(startSquare.parentElement.children).indexOf(startSquare);
        
    }

    function dragOver(event) {
        event.preventDefault();
    }
   

    function drop(event) {
        event.preventDefault();
        
        let targetSquare = event.target.classList.contains('wb') || event.target.classList.contains('bb') ? event.target : event.target.parentElement;
        let targetRow = Array.from(targetSquare.parentElement.parentElement.children).indexOf(targetSquare.parentElement);
        let targetCol = Array.from(targetSquare.parentElement.children).indexOf(targetSquare);
        let targetImg = targetSquare.querySelector('img');
        
        console.log(`Target Square: Row ${targetRow}, Col ${targetCol}`);
        console.log(`Dragged Element: ${draggedElement.src}`);
        console.log(`Current Turn: ${currentTurn}`);
        console.log(`Has White King Moved: ${hasWhiteKingMoved}`);
        console.log(`Has White Rook1 Moved: ${hasWhiteRook1Moved}`);
        console.log(`Has White Rook2 Moved: ${hasWhiteRook2Moved}`);
        console.log(`Has Black King Moved: ${hasBlackKingMoved}`);
        console.log(`Has Black Rook1 Moved: ${hasBlackRook1Moved}`);
        console.log(`Has Black Rook2 Moved: ${hasBlackRook2Moved}`);
        
        let isWhiteKing = draggedElement.src.includes('king-w.svg');
        let isBlackKing = draggedElement.src.includes('king-b.svg');
        let kingRow = isWhiteKing ? 7 : 0;
        let kingCol = 4; // Fixed column for the king's initial position
    
        // Castling logic for white king
        if (isWhiteKing && (targetCol === 2 || targetCol === 6)) {
            console.log('Attempting to castle...');
            
            // Explicitly check if the king's initial position is in check before allowing castling
            if (isInCheckAfterMove(kingRow, kingCol)) {
                console.log('King is in check at its current position (7, 4), cannot castle.');
                return;
            }
    
            if (currentTurn === 'white' && !hasWhiteKingMoved) {
                console.log('White king is attempting to castle...');
                
                if (targetCol === 2) { // Queen-side castling
                    console.log('Checking queen-side castling conditions...');
                    const pathClear = isPathClearforking(7, 4, 7, 0);
                    const checkFree = !isInCheckAfterMove(7, 2) && !isInCheckAfterMove(7, 3);
                    console.log(`Path clear: ${pathClear}, Check free: ${checkFree}`);
                    
                    if (!hasWhiteRook1Moved && pathClear && checkFree) {
                        // Perform castling move
                        const rook = document.getElementById('square-r7-c0').querySelector('img');
                        targetSquare.appendChild(draggedElement);
                        document.getElementById('square-r7-c3').appendChild(rook);
                        hasWhiteKingMoved = true;
                        hasWhiteRook1Moved = true; // Update the left rook's movement state
                        console.log('White king castled queenside');
                        clearHighlights();
                        currentTurn = 'black'; // Switch turn
                        rotateBoard();
                        return;
                    } else {
                        console.log('Queen-side castling conditions not met');
                    }
                } else if (targetCol === 6) { // King-side castling
                    console.log('Checking king-side castling conditions...');
                    const pathClear = isPathClearforking(7, 4, 7, 7);
                    const checkFree = !isInCheckAfterMove(7, 5) && !isInCheckAfterMove(7, 6);
                    console.log(`Path clear: ${pathClear}, Check free: ${checkFree}`);
                    
                    if (!hasWhiteRook2Moved && pathClear && checkFree) {
                        // Perform castling move
                        const rook = document.getElementById('square-r7-c7').querySelector('img');
                        targetSquare.appendChild(draggedElement);
                        document.getElementById('square-r7-c5').appendChild(rook);
                        hasWhiteKingMoved = true;
                        hasWhiteRook2Moved = true; // Update the right rook's movement state
                        console.log('White king castled kingside');
                        clearHighlights();
                        currentTurn = 'black'; // Switch turn
                        rotateBoard();
                        return;
                    } else {
                        console.log('King-side castling conditions not met');
                    }
                }
            } else {
                console.log('Invalid move or king has already moved');
            }
        }
        
        // Castling logic for black king
        else if (isBlackKing && (targetCol === 2 || targetCol === 6)) {
            console.log('Attempting to castle...');
            
            // Explicitly check if the king's initial position is in check before allowing castling
            if (isInCheckAfterMove(kingRow, kingCol)) {
                console.log('King is in check at its current position (0, 4), cannot castle.');
                return;
            }
    
            if (currentTurn === 'black' && !hasBlackKingMoved) {
                console.log('Black king is attempting to castle...');
                
                if (targetCol === 2) { // Queen-side castling
                    console.log('Checking queen-side castling conditions...');
                    const pathClear = isPathClearforking(0, 4, 0, 0);
                    const checkFree = !isInCheckAfterMove(0, 2) && !isInCheckAfterMove(0, 3);
                    console.log(`Path clear: ${pathClear}, Check free: ${checkFree}`);
                    
                    if (!hasBlackRook1Moved && pathClear && checkFree) {
                        // Perform castling move
                        const rook = document.getElementById('square-r0-c0').querySelector('img');
                        targetSquare.appendChild(draggedElement);
                        document.getElementById('square-r0-c3').appendChild(rook);
                        hasBlackKingMoved = true;
                        hasBlackRook1Moved = true; // Update the left rook's movement state
                        clearHighlights();
                        console.log('Black king castled queenside');
                        currentTurn = 'white'; // Switch turn
                        rotateBoard();
                        return;
                    } else {
                        console.log('Queen-side castling conditions not met');
                    }
                } else if (targetCol === 6) { // King-side castling
                    console.log('Checking king-side castling conditions...');
                    const pathClear = isPathClearforking(0, 4, 0, 7);
                    const checkFree = !isInCheckAfterMove(0, 5) && !isInCheckAfterMove(0, 6);
                    console.log(`Path clear: ${pathClear}, Check free: ${checkFree}`);
                    
                    if (!hasBlackRook2Moved && pathClear && checkFree) {
                        // Perform castling move
                        const rook = document.getElementById('square-r0-c7').querySelector('img');
                        targetSquare.appendChild(draggedElement);
                        document.getElementById('square-r0-c5').appendChild(rook);
                        hasBlackKingMoved = true;
                        hasBlackRook2Moved = true; // Update the right rook's movement state
                        console.log('Black king castled kingside');
                        clearHighlights();
                        currentTurn = 'white'; // Switch turn
                        rotateBoard();
                        return;
                    } else {
                        console.log('King-side castling conditions not met');
                    }
                }
            } else {
                console.log('Invalid move or king has already moved');
            }
        }
    

        function rotateBoard() {
            const board = document.querySelector('.chessboard');
            const pieces = document.querySelectorAll('.chessboard img');
        
            if (currentTurn === 'black') {
                board.classList.add('rotated');
                pieces.forEach(piece => piece.classList.add('piece-rotated'));
            } else {
                board.classList.remove('rotated');
                pieces.forEach(piece => piece.classList.remove('piece-rotated'));
            }
        }
        
    
        console.log(`Dragging: ${draggedElement.alt}, Current Position: [${startRow}, ${startCol}], Attempting to drop at: [${targetRow}, ${targetCol}]`);
    
        // Determine the color of the piece being moved
        const pieceColor = draggedElement.src.includes('-w.svg') ? 'white' : 'black';
    
        // Check if it's the current player's turn
        if ((currentTurn === 'white' && pieceColor === 'black') || (currentTurn === 'black' && pieceColor === 'white')) {
            console.log(`Invalid move: It's ${currentTurn}'s turn.`);
            return; // Prevent the move
        }
    
        if (!targetImg || (draggedElement.src.includes('-w.svg') && targetImg.src.includes('-b.svg')) || (draggedElement.src.includes('-b.svg') && targetImg.src.includes('-w.svg'))) {
            let isValidMove = false;
    
            // Validate the move based on the piece type
            if (draggedElement.src.includes('pawn')) {
                isValidMove = isValidPawnMove(targetRow, targetCol);
            } else if (draggedElement.src.includes('rook')) {
                isValidMove = isValidRookMove(targetRow, targetCol);
            } else if (draggedElement.src.includes('knight')) {
                isValidMove = isValidKnightMove(targetRow, targetCol);
            } else if (draggedElement.src.includes('bishop')) {
                isValidMove = isValidBishopMove(targetRow, targetCol);
            } else if (draggedElement.src.includes('queen')) {
                isValidMove = isValidQueenMove(targetRow, targetCol);
            } else if (draggedElement.src.includes('king')) {
                isValidMove = isValidKingMove(targetRow, targetCol);
            }
    
            if (isValidMove) {
                clearHighlights();
                clearHighlight();
                const strc = document.getElementById(`square-r${startRow}-c${startCol}`);
                const tarc = document.getElementById(`square-r${targetRow}-c${targetCol}`);
                strc.classList.add('highlight-movement');
                tarc.classList.add('highlight-movement');
    
                console.log(`${draggedElement.alt} move valid`);
                if (targetImg) {
                    targetImg.parentNode.removeChild(targetImg); // Capture the piece
                    console.log("Piece captured:", targetImg.alt);
                }
                targetSquare.appendChild(draggedElement);
    
               // Determine if the dragged piece is a king or a rook based on its src
const isWhiteKing = draggedElement.src.includes('king-w.svg');
const isBlackKing = draggedElement.src.includes('king-b.svg');
const isWhiteRook = draggedElement.src.includes('rook-w.svg');
const isBlackRook = draggedElement.src.includes('rook-b.svg');

// Track movement of the King and Rook
if (isWhiteKing) {
    hasWhiteKingMoved = true;
} else if (isBlackKing) {
    hasBlackKingMoved = true;
} else if (isWhiteRook) {
    if (currentTurn === 'white') {
        // Check the position of the rook to determine which one has moved
        if (startCol === 0) { // Left rook (a1)
            hasWhiteRook1Moved = true;
        } else if (startCol === 7) { // Right rook (h1)
            hasWhiteRook2Moved = true;
        }
    }
} else if (isBlackRook) {
    if (currentTurn === 'black') {
        // Check the position of the rook to determine which one has moved
        if (startCol === 0) { // Left rook (a8)
            hasBlackRook1Moved = true;
        } else if (startCol === 7) { // Right rook (h8)
            hasBlackRook2Moved = true;
        }
    }
}

// Update the movement tracking for castling
if (isWhiteKing && (targetCol === 2 || targetCol === 6)) {
    // Castling logic for white king
    if (targetCol === 2) { // Queen-side castling
        hasWhiteKingMoved = true;
        hasWhiteRook1Moved = true; // Update the left rook's movement state
    } else if (targetCol === 6) { // King-side castling
        hasWhiteKingMoved = true;
        hasWhiteRook2Moved = true; // Update the right rook's movement state
    }
} else if (isBlackKing && (targetCol === 2 || targetCol === 6)) {
    // Castling logic for black king
    if (targetCol === 2) { // Queen-side castling
        hasBlackKingMoved = true;
        hasBlackRook1Moved = true; // Update the left rook's movement state
    } else if (targetCol === 6) { // King-side castling
        hasBlackKingMoved = true;
        hasBlackRook2Moved = true; // Update the right rook's movement state
    }
}
    
                // Rotate the board after a valid move
                const board = document.getElementById('myboard');
                board.classList.toggle('rotated');
    
                // Rotate all pieces when the board is rotated
                const pieces = document.querySelectorAll('.chessboard img');
                pieces.forEach(piece => {
                    piece.classList.toggle('piece-rotated');
                });
    
                // Switch turn
                currentTurn = currentTurn === 'white' ? 'black' : 'white';
            } else {
                console.log('Move invalid');
                startSquare.appendChild(draggedElement); // Return the piece to its original place
            }
        } else {
            console.log('Drop target invalid due to same color piece.');
            startSquare.appendChild(draggedElement); // Return the piece to its original
        }
    } 

    function isPathClearforking(fromRow, fromCol, toRow, toCol) {
        const stepRow = fromRow === toRow ? 0 : (toRow > fromRow ? 1 : -1);
        const stepCol = fromCol === toCol ? 0 : (toCol > fromCol ? 1 : -1);
    
        let currentRow = fromRow + stepRow;
        let currentCol = fromCol + stepCol;
    
        while (currentRow !== toRow || currentCol !== toCol) {
            const square = document.getElementById(`square-r${currentRow}-c${currentCol}`);
            if (square && square.querySelector('img')) {
                return false; // Path is not clear
            }
            currentRow += stepRow;
            currentCol += stepCol;
        }
        return true; // Path is clear
    }

    
    
    function isInCheckAfterMove(kingRow, kingCol) {
        const kingColor = draggedElement.src.includes('-w.svg') ? 'white' : 'black';
      
        const opponentColor  = kingColor === 'white' ? 'black' : 'white'; // Determine opponent color
        const opponentPieces = document.querySelectorAll(`img[src*='${opponentColor[0]}']`); // Select opponent pieces
        
    
        
        for (let piece of opponentPieces) {
            const pieceSquare = piece.parentElement;
            const pieceRow = parseInt(pieceSquare.id.split('-')[1].substring(1));
            const pieceCol = parseInt(pieceSquare.id.split('-')[2].substring(1));
    
            // Debug logs
            console.log(`Checking piece at [${pieceRow}, ${pieceCol}] - Type: ${piece.src.split('/').pop()}`);
            
            // Check if the opponent piece can move to the king's position
            if (canPieceAttack(piece, pieceRow, pieceCol, kingRow, kingCol)) {
                console.log(`King in check from piece at [${pieceRow}, ${pieceCol}]`);
                return true; // The king is in check
            }
        }
    
        return false; // The king is not in check
    }
    
    
    
    function canPieceAttack(piece, fromRow, fromCol, toRow, toCol) {

        const kingColor = draggedElement.src.includes('-w.svg') ? 'white' : 'black';
      
        const opponentColor  = kingColor === 'white' ? 'black' : 'white'; // Determine opponent color
        const opponentPieces = document.querySelectorAll(`img[src*='${opponentColor[0]}']`); // Select opponent pieces
        
        // Defensive check for piece
        if (!piece) {
            console.error("Piece is undefined");
            return false; // Early return if piece is undefined
        }
    
        const pieceType = piece.src.split('/').pop(); // Get the piece type (e.g., 'pawn-w.svg')
        const isPieceWhite = piece.src.includes('-w.svg');
        
        // Only opponent pieces should be checked
        const isDraggingWhite = draggedElement.src.includes('-w.svg');
    
        if ((isDraggingWhite && !isPieceWhite) || (!isDraggingWhite && isPieceWhite)) {
            switch (true) {
                case pieceType.includes('pawn'):
                    return canPawnAttack(piece, fromRow, fromCol, toRow, toCol);
                case pieceType.includes('rook'):
                    return canRookAttack(fromRow, fromCol, toRow, toCol);
                case pieceType.includes('knight'):
                    return canKnightAttack(fromRow, fromCol, toRow, toCol);
                case pieceType.includes('bishop'):
                    return canBishopAttack(fromRow, fromCol, toRow, toCol);
                case pieceType.includes('queen'):
                    return canQueenAttack(fromRow, fromCol, toRow, toCol);
                case pieceType.includes('king'):
                    return canKingAttack(fromRow, fromCol, toRow, toCol);
                default:
                    return false; // Unknown piece type
            }
        }
    
        return false; // Piece is not an opponent
    }
    
    
    
    function canPawnAttack(piece, fromRow, fromCol, toRow, toCol) {
        const direction = piece.src.includes('-w.svg') ? -1 : 1; // Determine direction based on color
        const result = (toRow === fromRow + direction && Math.abs(toCol - fromCol) === 1);
        console.log(`Pawn attack from [${fromRow}, ${fromCol}] to [${toRow}, ${toCol}] - Result: ${result}`);
        return result;
    }
    
    function canRookAttack(fromRow, fromCol, toRow, toCol) {
        const result = (fromRow === toRow || fromCol === toCol) && isPathClear(fromRow, fromCol, toRow, toCol);
        console.log(`Rook attack from [${fromRow}, ${fromCol}] to [${toRow}, ${toCol}] - Result: ${result}`);
        return result;
    }
    
    function canKnightAttack(fromRow, fromCol, toRow, toCol) {
        const rowDifference = Math.abs(toRow - fromRow);
        const colDifference = Math.abs(toCol - fromCol);
        const result = (rowDifference === 2 && colDifference === 1) || (rowDifference === 1 && colDifference === 2);
        console.log(`Knight attack from [${fromRow}, ${fromCol}] to [${toRow}, ${toCol}] - Result: ${result}`);
        return result;
    }
    
    function canBishopAttack(fromRow, fromCol, toRow, toCol) {
        const result = Math.abs(toRow - fromRow) === Math.abs(toCol - fromCol) && isPathClear(fromRow, fromCol, toRow, toCol);
        console.log(`Bishop attack from [${fromRow}, ${fromCol}] to [${toRow}, ${toCol}] - Result: ${result}`);
        return result;
    }
    
    function canQueenAttack(fromRow, fromCol, toRow, toCol) {
        const result = (canRookAttack(fromRow, fromCol, toRow, toCol) || canBishopAttack(fromRow, fromCol, toRow, toCol));
        console.log(`Queen attack from [${fromRow}, ${fromCol}] to [${toRow}, ${toCol}] - Result: ${result}`);
        return result;
    }
    
    function canKingAttack(fromRow, fromCol, toRow, toCol) {
        const rowDifference = Math.abs(toRow - fromRow);
        const colDifference = Math.abs(toCol - fromCol);
        const result = (rowDifference <= 1 && colDifference <= 1);
        console.log(`King attack from [${fromRow}, ${fromCol}] to [${toRow}, ${toCol}] - Result: ${result}`);
        return result;
    }
    
    
    




    let lastMove = null; // Variable to track the last move

    // Function to update the last move
    function updateLastMove(from, to) {
        lastMove = { from, to };
        console.log(`Last move updated: from ${from} to ${to}`);
    }
    
 
    
   
    // Function to check if a pawn move is valid
    function isValidPawnMove(targetRow, targetCol) {
        const rowDifference = targetRow - startRow;
        const colDifference = targetCol - startCol;
    
        // Target square element
        const targetSquare = document.querySelector(`#square-r${targetRow}-c${targetCol}`);
        console.log(`Moving piece from [${startRow}, ${startCol}] to [${targetRow}, ${targetCol}]`);
    
        // Check for white pawn moves
        if (draggedElement.src.includes('pawn-w.svg')) {
            console.log('Detected white pawn move');
    
            // Moving straight
            if (colDifference === 0) {
                if ((startRow === 6 && (rowDifference === -1 || rowDifference === -2) && isPathClear(startRow, startCol, targetRow, targetCol)) ||
                    (rowDifference === -1 && isPathClear(startRow, startCol, targetRow, targetCol))) {
                    
                    if (!targetSquare.querySelector('img')) {
                        console.log('Valid move for white pawn (straight move)');
                        updateLastMove(startSquare.id, targetSquare.id);
                        return true;
                    }
                }
            }
    
            // Capturing diagonally
            if (Math.abs(colDifference) === 1 && rowDifference === -1) {
                const targetPiece = targetSquare ? targetSquare.querySelector('img') : null;
                if (targetPiece && targetPiece.src.includes('-b.svg')) {
                    console.log('Valid capture for white pawn');
                    updateLastMove(startSquare.id, targetSquare.id);
                    return true;
                }
            }
    
            // En passant capture
            if (Math.abs(colDifference) === 1 && rowDifference === -1) {
                const adjacentSquare = document.querySelector(`#square-r${startRow}-c${targetCol}`);
                const targetPiece = adjacentSquare ? adjacentSquare.querySelector('img') : null;
                if (targetPiece && targetPiece.src.includes('pawn-b.svg') && lastMove &&
                    lastMove.from === `square-r${startRow - 2}-c${targetCol}` && lastMove.to === adjacentSquare.id) {
                    console.log('Valid en passant capture for white pawn');
                    targetPiece.remove(); // Remove the captured black pawn
                    updateLastMove(startSquare.id, targetSquare.id);
                    return true;
                }
            }
        }
    
        // Check for black pawn moves
        else if (draggedElement.src.includes('pawn-b.svg')) {
            console.log('Detected black pawn move');
    
            // Moving straight
            if (colDifference === 0) {
                if ((startRow === 1 && (rowDifference === 1 || rowDifference === 2) && isPathClear(startRow, startCol, targetRow, targetCol)) ||
                    (rowDifference === 1 && isPathClear(startRow, startCol, targetRow, targetCol))) {
                    
                    if (!targetSquare.querySelector('img')) {
                        console.log('Valid move for black pawn (straight move)');
                        updateLastMove(startSquare.id, targetSquare.id);
                        return true;
                    }
                }
            }
    
            // Capturing diagonally
            if (Math.abs(colDifference) === 1 && rowDifference === 1) {
                const targetPiece = targetSquare ? targetSquare.querySelector('img') : null;
                if (targetPiece && targetPiece.src.includes('-w.svg')) {
                    console.log('Valid capture for black pawn');
                    updateLastMove(startSquare.id, targetSquare.id);
                    return true;
                }
            }
    
            // En passant capture
            if (Math.abs(colDifference) === 1 && rowDifference === 1) {
                const adjacentSquare = document.querySelector(`#square-r${startRow}-c${targetCol}`);
                const targetPiece = adjacentSquare ? adjacentSquare.querySelector('img') : null;
                if (targetPiece && targetPiece.src.includes('pawn-w.svg') && lastMove &&
                    lastMove.from === `square-r${startRow + 2}-c${targetCol}` && lastMove.to === adjacentSquare.id) {
                    console.log('Valid en passant capture for black pawn');
                    targetPiece.remove(); // Remove the captured white pawn
                    updateLastMove(startSquare.id, targetSquare.id);
                    return true;
                }
            }
        }
    
        // If none of the conditions are met, the move is invalid
        console.log('Invalid move for pawn');
        return false;
    }
    
    
    function isValidRookMove(targetRow, targetCol) {
        return (targetRow === startRow || targetCol === startCol) && isPathClear(startRow, startCol, targetRow, targetCol);
    }

    function isValidKnightMove(targetRow, targetCol) {
        let rowDifference = Math.abs(targetRow - startRow);
        let colDifference = Math.abs(targetCol - startCol);
        return (rowDifference === 2 && colDifference === 1) || (rowDifference === 1 && colDifference === 2);
    }

    function isValidBishopMove(targetRow, targetCol) {
        return Math.abs(targetRow - startRow) === Math.abs(targetCol - startCol) && isPathClear(startRow, startCol, targetRow, targetCol);
    }

    function isValidQueenMove(targetRow, targetCol) {
        return (targetRow === startRow || targetCol === startCol || Math.abs(targetRow - startRow) === Math.abs(targetCol - startCol)) && isPathClear(startRow, startCol, targetRow, targetCol);
    }

    function isValidKingMove(targetRow, targetCol) {
        let rowDifference = Math.abs(targetRow - startRow);
        let colDifference = Math.abs(targetCol - startCol);
        return (rowDifference <= 1 && colDifference <= 1);
    }

    function isPathClear(startRow, startCol, targetRow, targetCol, allowCapture = false) {
        let stepRow = startRow === targetRow ? 0 : (targetRow > startRow ? 1 : -1);
        let stepCol = startCol === targetCol ? 0 : (targetCol > startCol ? 1 : -1);
    
        let currentRow = startRow + stepRow;
        let currentCol = startCol + stepCol;
        let path = []; // Array to store the path coordinates
    
        // Traverse path up to (but not including) the target square
        while (currentRow !== targetRow || currentCol !== targetCol) {
            let square = document.querySelector(`#square-r${currentRow}-c${currentCol}`);
            
            // Add current position to path array
            path.push(`[${currentRow}, ${currentCol}]`);
    
            // If any piece is in the path, print the path and return false
            if (square && square.querySelector('img')) {
                console.log("Path blocked at:", `[${currentRow}, ${currentCol}]`);
                console.log("Path checked so far:", path.join(" -> "));
                return false;
            }
    
            currentRow += stepRow;
            currentCol += stepCol;
        }
    
        // Path is clear up to target; add final target position to path if needed
        path.push(`[${targetRow}, ${targetCol}]`);
        console.log("Complete Path:", path.join(" -> "));
    
        // Capture logic for the target square, if allowed
        if (allowCapture) {
            let targetSquare = document.querySelector(`#square-r${targetRow}-c${targetCol}`);
            let targetPiece = targetSquare.querySelector('img');
    
            if (targetPiece) {
                let draggedColor = draggedElement.src.includes('-w.svg') ? 'w' : 'b';
                let targetColor = targetPiece.src.includes('-w.svg') ? 'w' : 'b';
                return draggedColor !== targetColor; // True if opponent piece is present
            }
        }
    
        return true; // Path is clear and no capture needed or opponent piece at target
    }
    


    function isSquareUnderAttack(row, col, opponentColor) {
        console.log(`Checking if square [${row}, ${col}] is under attack by ${opponentColor} pieces`);
        const pieces = document.querySelectorAll(`img[src*='${opponentColor}']`);
    
        for (let piece of pieces) {
            const pieceRow = parseInt(piece.parentElement.id.split('-')[1].substring(1));
            const pieceCol = parseInt(piece.parentElement.id.split('-')[2].substring(1));
            console.log(`Checking piece at [${pieceRow}, ${pieceCol}] - Type: ${piece.src}`);
            if (isInCheckAfterMove(row,col)) {
                console.log(`Square [${row}, ${col}] is under attack by piece at [${pieceRow}, ${pieceCol}]`);
                return true;
            }
        }
        console.log(`Square [${row}, ${col}] is not under attack by any ${opponentColor} pieces`);
        return false;
    }
    
    
    function clearHighlights() { document.querySelectorAll('.highlight-move, .highlight-capture').forEach(square => { square.classList.remove('highlight-move', 'highlight-capture'); }); }
    function clearHighlight() { document.querySelectorAll('.highlight-movement').forEach(square => { square.classList.remove('highlight-movement'); }); }
    document.querySelectorAll('.chessboard img').forEach(piece => {
        piece.addEventListener('click', event => {
            clearHighlights();
            clearHighlight();
            
            const pieceElement = event.target;
            const startRow = parseInt(pieceElement.parentElement.id.split('-')[1].substring(1));
            const startCol = parseInt(pieceElement.parentElement.id.split('-')[2].substring(1));
    
            if(pieceElement.src.includes('pawn-w.svg')){
                const squ1 = document.getElementById(`square-r${startRow - 1}-c${startCol}`);
                const squ2 = document.getElementById(`square-r${startRow - 2}-c${startCol}`);
                const squLeft = document.getElementById(`square-r${startRow - 1}-c${startCol - 1}`);
                const squRight = document.getElementById(`square-r${startRow - 1}-c${startCol + 1}`);
                const squadl=document.getElementById(`square-r${startRow}-c${startCol - 1}`);
                const squadr=document.getElementById(`square-r${startRow}-c${startCol + 1}`);
                if((startRow-1)>=0){
               

                if(startRow===6 && !squ1.querySelector('img')){
                   
                    squ1.classList.add('highlight-move');
                    if(!squ2.querySelector('img')){
                    squ2.classList.add('highlight-move');}
                }
                else if (!squ1.querySelector('img')){
                    squ1.classList.add('highlight-move');
                }
         
                if (squLeft && squLeft.querySelector('img') && squLeft.querySelector('img').src.includes('-b')) {
                 
                     squLeft.classList.add('highlight-capture'); } 

                if (squRight && squRight.querySelector('img') && squRight.querySelector('img').src.includes('-b')) { 
                
                    squRight.classList.add('highlight-capture'); }

                if(startRow===3 && (squadl && squadl.querySelector('img') && squadl.querySelector('img').src.includes('-b')) && (lastMove &&
                lastMove.from === `square-r${startRow - 2}-c${startCol-1}`) )  {
                    squLeft.classList.add('highlight-capture');
                }  

                if(startRow===3 && (squadr && squadr.querySelector('img') && squadr.querySelector('img').src.includes('-b')) && (lastMove &&
                    lastMove.from === `square-r${startRow - 2}-c${startCol+1}`) )  {
                        squRight.classList.add('highlight-capture');
                    }  

    
            }

            else{
                console.log('No movable place');
            }
                
            }

            else if(pieceElement.src.includes('pawn-b.svg')) {
                const squ1 = document.getElementById(`square-r${startRow + 1}-c${startCol}`);
                const squ2 = document.getElementById(`square-r${startRow + 2}-c${startCol}`);
                const squLeft = document.getElementById(`square-r${startRow + 1}-c${startCol - 1}`);
                const squRight = document.getElementById(`square-r${startRow + 1}-c${startCol + 1}`);
                const squadl = document.getElementById(`square-r${startRow}-c${startCol - 1}`);
                const squadr = document.getElementById(`square-r${startRow}-c${startCol + 1}`);
            
                // Ensure the pawn is within the board boundaries
                if (startRow + 1 <= 7) {
                    
                    // Check for single move
                    if (startRow === 1 && !squ1.querySelector('img')) {
                        squ1.classList.add('highlight-move');
                        if (startRow + 2 <= 7 && !squ2.querySelector('img')) {
                            squ2.classList.add('highlight-move');
                        }
                    } else if (!squ1.querySelector('img')) {
                        squ1.classList.add('highlight-move');
                    }
            
                    // Check for captures
                    if (squLeft && squLeft.querySelector('img') && squLeft.querySelector('img').src.includes('-w')) {
                        squLeft.classList.add('highlight-capture');
                    }
            
                    if (squRight && squRight.querySelector('img') && squRight.querySelector('img').src.includes('-w')) {
                        squRight.classList.add('highlight-capture');
                    }
            
                    // Handle en passant (if applicable)
                    if (startRow === 3) {
                        if (squadl && squadl.querySelector('img') && squadl.querySelector('img').src.includes('-w') && lastMove &&
                            lastMove.from === `square-r${startRow + 2}-c${startCol - 1}`) {
                            squadr.classList.add('highlight-capture');
                        }
            
                        if (squadr && squadr.querySelector('img') && squadr.querySelector('img').src.includes('-w') && lastMove &&
                            lastMove.from === `square-r${startRow + 2}-c${startCol + 1}`) {
                            squLeft.classList.add('highlight-capture');
                        }
                    }
                } else {
                    console.log('No movable place');
                }
            }



            else if(pieceElement.src.includes('rook-w')){
                
                    for(let i=1;i<8;i++){
                        let squp=document.getElementById(`square-r${startRow - i}-c${startCol}`);
                        
                        if(squp && !squp.querySelector('img')){
                            
                            squp.classList.add('highlight-move');
                        }
                        else if ( pieceElement.src.includes('-w') && (squp && squp.querySelector('img').src.includes('-b'))){
                            squp.classList.add('highlight-capture');
                            break;
                        }
                        else if(squp && squp.querySelector('img')){
                            break;
                        }
                    }

                    for(let i=1;i<8;i++){
                        let sql=document.getElementById(`square-r${startRow}-c${startCol-i}`);
                        
                        if(sql && !sql.querySelector('img')){
                            sql.classList.add('highlight-move');
                        }
                        else if ( pieceElement.src.includes('-w') && (sql && sql.querySelector('img').src.includes('-b'))){
                            sql.classList.add('highlight-capture');
                            break;
                        }
                        else if(sql && sql.querySelector('img')){
                            break;
                        }
                    }

                    for(let i=1;i<8;i++){
                        let sqr=document.getElementById(`square-r${startRow}-c${startCol+i}`);
                        
                        if(sqr && !sqr.querySelector('img')){
                            sqr.classList.add('highlight-move');
                        }
                        else if ( pieceElement.src.includes('-w') && (sqr && sqr.querySelector('img').src.includes('-b'))){
                            sqr.classList.add('highlight-capture');
                            break;
                        }
                        else if(sqr && sqr.querySelector('img')){
                            break;
                        }
                    }


                    for(let i=1;i<8;i++){
                        let sqdn=document.getElementById(`square-r${startRow+i}-c${startCol}`);
                        if(sqdn && !sqdn.querySelector('img')){
                            sqdn.classList.add('highlight-move');
                        }
                        else if ( pieceElement.src.includes('-w') && (sqdn && sqdn.querySelector('img').src.includes('-b'))){
                            sqdn.classList.add('highlight-capture');
                            break;
                        }
                        else if(sqdn && sqdn.querySelector('img')){
                            break;
                        }
                    }
            }

            else if (pieceElement.src.includes('rook-b')) {
                // Highlight moves in all four directions for the rook
            
                // Upward direction
                for (let i = 1; i < 8; i++) {
                    let sqUp = document.getElementById(`square-r${startRow - i}-c${startCol}`);
                    
                    if (sqUp && !sqUp.querySelector('img')) {
                        sqUp.classList.add('highlight-move');
                    } else if ( pieceElement.src.includes('-b') && (sqUp && sqUp.querySelector('img').src.includes('-w'))) {
            
                        sqUp.classList.add('highlight-capture');
                        break;
                    } else if (sqUp && sqUp.querySelector('img')) {
                        break;
                    }
                }
            
                // Left direction
                for (let i = 1; i < 8; i++) {
                    let sqLeft = document.getElementById(`square-r${startRow}-c${startCol - i}`);
                    
                    if (sqLeft && !sqLeft.querySelector('img')) {
                        sqLeft.classList.add('highlight-move');
                    } else if ( pieceElement.src.includes('-b') && (sqLeft && sqLeft.querySelector('img').src.includes('-w'))) {
                        sqLeft.classList.add('highlight-capture');
                        break;
                    } else if (sqLeft && sqLeft.querySelector('img')) {
                        break;
                    }
                }
            
                // Right direction
                for (let i = 1; i < 8; i++) {
                    let sqRight = document.getElementById(`square-r${startRow}-c${startCol + i}`);
                    
                    if (sqRight && !sqRight.querySelector('img')) {
                        sqRight.classList.add('highlight-move');
                    } else if ( pieceElement.src.includes('-b') && (sqRight && sqRight.querySelector('img').src.includes('-w'))) {
                        sqRight.classList.add('highlight-capture');
                        break;
                    } else if (sqRight && sqRight.querySelector('img')) {
                        break;
                    }
                }
            
                // Downward direction
                for (let i = 1; i < 8; i++) {
                    let sqDown = document.getElementById(`square-r${startRow + i}-c${startCol}`);
                    
                    if (sqDown && !sqDown.querySelector('img')) {
                        sqDown.classList.add('highlight-move');
                    } else if ( pieceElement.src.includes('-b') && (sqDown && sqDown.querySelector('img').src.includes('-w'))) {
                        sqDown.classList.add('highlight-capture');
                        break;
                    } else if (sqDown && sqDown.querySelector('img')) {
                        break;
                    }
                }
            }

            else if (pieceElement.src.includes('bishop-w')) {
                // Up-Left direction
                for (let i = 1; i < 8; i++) {
                    let sqUpLeft = document.getElementById(`square-r${startRow - i}-c${startCol - i}`);
                    
                    if (sqUpLeft && !sqUpLeft.querySelector('img')) {
                        sqUpLeft.classList.add('highlight-move'); // Highlight as valid move
                    } else if (pieceElement.src.includes('-w') && (sqUpLeft && sqUpLeft.querySelector('img')?.src.includes('-b'))) {
                        sqUpLeft.classList.add('highlight-capture'); // Highlight as capture
                        break; // Stop checking further in this direction
                    } else if (sqUpLeft && sqUpLeft.querySelector('img')) {
                        break; // Stop if the piece is of the same color
                    }
                }
            
                // Up-Right direction
                for (let i = 1; i < 8; i++) {
                    let sqUpRight = document.getElementById(`square-r${startRow - i}-c${startCol + i}`);
                    
                    if (sqUpRight && !sqUpRight.querySelector('img')) {
                        sqUpRight.classList.add('highlight-move'); // Highlight as valid move
                    } else if (pieceElement.src.includes('-w') && (sqUpRight && sqUpRight.querySelector('img')?.src.includes('-b'))) {
                        sqUpRight.classList.add('highlight-capture'); // Highlight as capture
                        break; // Stop checking further in this direction
                    } else if (sqUpRight && sqUpRight.querySelector('img')) {
                        break; // Stop if the piece is of the same color
                    }
                }
            
                // Down-Left direction
                for (let i = 1; i < 8; i++) {
                    let sqDownLeft = document.getElementById(`square-r${startRow + i}-c${startCol - i}`);
                    
                    if (sqDownLeft && !sqDownLeft.querySelector('img')) {
                        sqDownLeft.classList.add('highlight-move'); // Highlight as valid move
                    } else if (pieceElement.src.includes('-w') && (sqDownLeft && sqDownLeft.querySelector('img')?.src.includes('-b'))) {
                        sqDownLeft.classList.add('highlight-capture'); // Highlight as capture
                        break; // Stop checking further in this direction
                    } else if (sqDownLeft && sqDownLeft.querySelector('img')) {
                        break; // Stop if the piece is of the same color
                    }
                }
            
                // Down-Right direction
                for (let i = 1; i < 8; i++) {
                    let sqDownRight = document.getElementById(`square-r${startRow + i}-c${startCol + i}`);
                    
                    if (sqDownRight && !sqDownRight.querySelector('img')) {
                        sqDownRight.classList.add('highlight-move'); // Highlight as valid move
                    } else if (pieceElement.src.includes('-w') && (sqDownRight && sqDownRight.querySelector('img')?.src.includes('-b'))) {
                        sqDownRight.classList.add('highlight-capture'); // Highlight as capture
                        break; // Stop checking further in this direction
                    } else if (sqDownRight && sqDownRight.querySelector('img')) {
                        break; // Stop if the piece is of the same color
                    }
                }
            }

            else if (pieceElement.src.includes('bishop-b')) {
                // Up-Left direction
                for (let i = 1; i < 8; i++) {
                    let sqUpLeft = document.getElementById(`square-r${startRow - i}-c${startCol - i}`);
                    
                    if (sqUpLeft && !sqUpLeft.querySelector('img')) {
                        sqUpLeft.classList.add('highlight-move'); // Highlight as valid move
                    } else if (pieceElement.src.includes('-b') && (sqUpLeft && sqUpLeft.querySelector('img')?.src.includes('-w'))) {
                        sqUpLeft.classList.add('highlight-capture'); // Highlight as capture
                        break; // Stop checking further in this direction
                    } else if (sqUpLeft && sqUpLeft.querySelector('img')) {
                        break; // Stop if the piece is of the same color
                    }
                }
            
                // Up-Right direction
                for (let i = 1; i < 8; i++) {
                    let sqUpRight = document.getElementById(`square-r${startRow - i}-c${startCol + i}`);
                    
                    if (sqUpRight && !sqUpRight.querySelector('img')) {
                        sqUpRight.classList.add('highlight-move'); // Highlight as valid move
                    } else if (pieceElement.src.includes('-b') && (sqUpRight && sqUpRight.querySelector('img')?.src.includes('-w'))) {
                        sqUpRight.classList.add('highlight-capture'); // Highlight as capture
                        break; // Stop checking further in this direction
                    } else if (sqUpRight && sqUpRight.querySelector('img')) {
                        break; // Stop if the piece is of the same color
                    }
                }
            
                // Down-Left direction
                for (let i = 1; i < 8; i++) {
                    let sqDownLeft = document.getElementById(`square-r${startRow + i}-c${startCol - i}`);
                    
                    if (sqDownLeft && !sqDownLeft.querySelector('img')) {
                        sqDownLeft.classList.add('highlight-move'); // Highlight as valid move
                    } else if (pieceElement.src.includes('-b') && (sqDownLeft && sqDownLeft.querySelector('img')?.src.includes('-w'))) {
                        sqDownLeft.classList.add('highlight-capture'); // Highlight as capture
                        break; // Stop checking further in this direction
                    } else if (sqDownLeft && sqDownLeft.querySelector('img')) {
                        break; // Stop if the piece is of the same color
                    }
                }
            
                // Down-Right direction
                for (let i = 1; i < 8; i++) {
                    let sqDownRight = document.getElementById(`square-r${startRow + i}-c${startCol + i}`);
                    
                    if (sqDownRight && !sqDownRight.querySelector('img')) {
                        sqDownRight.classList.add('highlight-move'); // Highlight as valid move
                    } else if (pieceElement.src.includes('-b') && (sqDownRight && sqDownRight.querySelector('img')?.src.includes('-w'))) {
                        sqDownRight.classList.add('highlight-capture'); // Highlight as capture
                        break; // Stop checking further in this direction
                    } else if (sqDownRight && sqDownRight.querySelector('img')) {
                        break; // Stop if the piece is of the same color
                    }
                }
            }


            else if (pieceElement.src.includes('knight-w')) {
                // Possible moves for a knight (in L shape)
                const knightMoves = [
                    { row: -2, col: -1 }, // Up 2, Left 1
                    { row: -2, col: 1 },  // Up 2, Right 1
                    { row: -1, col: -2 }, // Up 1, Left 2
                    { row: -1, col: 2 },  // Up 1, Right 2
                    { row: 1, col: -2 },  // Down 1, Left 2
                    { row: 1, col: 2 },   // Down 1, Right 2
                    { row: 2, col: -1 },  // Down 2, Left 1
                    { row: 2, col: 1 }    // Down 2, Right 1
                ];
            
                // Check each possible move
                for (let move of knightMoves) {
                    let targetRow = startRow + move.row;
                    let targetCol = startCol + move.col;
                    let targetSquare = document.getElementById(`square-r${targetRow}-c${targetCol}`);
            
                    // Check if the target square is within the board boundaries
                    if (targetSquare) {
                        if (!targetSquare.querySelector('img')) {
                            targetSquare.classList.add('highlight-move'); // Highlight as valid move
                        } else if (pieceElement.src.includes('-w') && targetSquare.querySelector('img').src.includes('-b')) {
                            targetSquare.classList.add('highlight-capture'); // Highlight as capture
                        }
                    }
                }
            }

            else if (pieceElement.src.includes('knight-b')) {
                // Possible moves for a knight (in L shape)
                const knightMoves = [
                    { row: -2, col: -1 }, // Up 2, Left 1
                    { row: -2, col: 1 },  // Up 2, Right 1
                    { row: -1, col: -2 }, // Up 1, Left 2
                    { row: -1, col: 2 },  // Up 1, Right 2
                    { row: 1, col: -2 },  // Down 1, Left 2
                    { row: 1, col: 2 },   // Down 1, Right 2
                    { row: 2, col: -1 },  // Down 2, Left 1
                    { row: 2, col: 1 }    // Down 2, Right 1
                ];
            
                // Check each possible move
                for (let move of knightMoves) {
                    let targetRow = startRow + move.row;
                    let targetCol = startCol + move.col;
                    let targetSquare = document.getElementById(`square-r${targetRow}-c${targetCol}`);
            
                    // Check if the target square is within the board boundaries
                    if (targetSquare) {
                        if (!targetSquare.querySelector('img')) {
                            targetSquare.classList.add('highlight-move'); // Highlight as valid move
                        } else if (pieceElement.src.includes('-b') && targetSquare.querySelector('img').src.includes('-w')) {
                            targetSquare.classList.add('highlight-capture'); // Highlight as capture
                        }
                    }
                }
            }
            

            else if (pieceElement.src.includes('queen-w')) {
                // Possible directions for a queen: horizontal, vertical, and diagonal
                const directions = [
                    { row: -1, col: 0 }, // Up
                    { row: 1, col: 0 },  // Down
                    { row: 0, col: -1 }, // Left
                    { row: 0, col: 1 },  // Right
                    { row: -1, col: -1 }, // Up-Left
                    { row: -1, col: 1 },  // Up-Right
                    { row: 1, col: -1 },  // Down-Left
                    { row: 1, col: 1 }    // Down-Right
                ];
            
                // Check each direction
                for (let direction of directions) {
                    for (let i = 1; i < 8; i++) { // Move up to 7 squares in that direction
                        let targetRow = startRow + direction.row * i;
                        let targetCol = startCol + direction.col * i;
                        let targetSquare = document.getElementById(`square-r${targetRow}-c${targetCol}`);
            
                        // Check if the target square is within the board boundaries
                        if (targetSquare) {
                            if (!targetSquare.querySelector('img')) {
                                targetSquare.classList.add('highlight-move'); // Highlight as valid move
                            } else if (pieceElement.src.includes('-w') && targetSquare.querySelector('img').src.includes('-b')) {
                                targetSquare.classList.add('highlight-capture'); // Highlight as capture
                                break; // Stop checking further in this direction
                            } else {
                                break; // Stop if the piece is of the same color
                            }
                        } else {
                            break; // Stop if the target square is out of bounds
                        }
                    }
                }
            }

            else if (pieceElement.src.includes('queen-b')) {
                // Possible directions for a queen: horizontal, vertical, and diagonal
                const directions = [
                    { row: -1, col: 0 }, // Up
                    { row: 1, col: 0 },  // Down
                    { row: 0, col: -1 }, // Left
                    { row: 0, col: 1 },  // Right
                    { row: -1, col: -1 }, // Up-Left
                    { row: -1, col: 1 },  // Up-Right
                    { row: 1, col: -1 },  // Down-Left
                    { row: 1, col: 1 }    // Down-Right
                ];
            
                // Check each direction
                for (let direction of directions) {
                    for (let i = 1; i < 8; i++) { // Move up to 7 squares in that direction
                        let targetRow = startRow + direction.row * i;
                        let targetCol = startCol + direction.col * i;
                        let targetSquare = document.getElementById(`square-r${targetRow}-c${targetCol}`);
            
                        // Check if the target square is within the board boundaries
                        if (targetSquare) {
                            if (!targetSquare.querySelector('img')) {
                                targetSquare.classList.add('highlight-move'); // Highlight as valid move
                            } else if (pieceElement.src.includes('-b') && targetSquare.querySelector('img').src.includes('-w')) {
                                targetSquare.classList.add('highlight-capture'); // Highlight as capture
                                break; // Stop checking further in this direction
                            } else {
                                break; // Stop if the piece is of the same color
                            }
                        } else {
                            break; // Stop if the target square is out of bounds
                        }
                    }
                }
            }


// Determine if the clicked piece is a king based on its src
const isWhiteKing = pieceElement.src.includes('king-w.svg');
const isBlackKing = pieceElement.src.includes('king-b.svg');


// Highlight possible moves for the king
if (isWhiteKing || isBlackKing) {
    const kingMoves = [
        { row: -1, col: 0 },  // Up
        { row: 1, col: 0 },   // Down
        { row: 0, col: -1 },  // Left
        { row: 0, col: 1 },   // Right
        { row: -1, col: -1 }, // Up-Left
        { row: -1, col: 1 },  // Up-Right
        { row: 1, col: -1 },  // Down-Left
        { row: 1, col: 1 }    // Down-Right
    ];

    for (let move of kingMoves) {
        let targetRow = startRow + move.row;
        let targetCol = startCol + move.col;
        let targetSquare = document.getElementById(`square-r${targetRow}-c${targetCol}`);

        if (targetSquare && !isSquareUnderAttack(targetRow, targetCol, isWhiteKing ? '-b' : '-w')) {
            if (!targetSquare.querySelector('img')) {
                targetSquare.classList.add('highlight-move'); // Highlight as valid move
            } else if (isWhiteKing && targetSquare.querySelector('img').src.includes('-b')) {
                targetSquare.classList.add('highlight-capture'); // Highlight as capture
            } else if (isBlackKing && targetSquare.querySelector('img').src.includes('-w')) {
                targetSquare.classList.add('highlight-capture'); // Highlight as capture
            }
        }
    }

    // Add castling logic
    const isCurrentTurnWhite = currentTurn === 'white';
    const rook1Moved = isCurrentTurnWhite ? hasWhiteRook1Moved : hasBlackRook1Moved;
    const rook2Moved = isCurrentTurnWhite ? hasWhiteRook2Moved : hasBlackRook2Moved;
    const kingRow = startRow;
    const kingCol = startCol;

    // Ensure the king is not in check currently
    if (!isInCheckAfterMove(kingRow, kingCol)) {
        // King-side castling
        if (!rook2Moved &&
            !isSquareUnderAttack(kingRow, kingCol + 1, isCurrentTurnWhite ? '-b' : '-w') &&
            !isSquareUnderAttack(kingRow, kingCol + 2, isCurrentTurnWhite ? '-b' : '-w')) {

            const kingSideSquare1 = document.getElementById(`square-r${kingRow}-c${kingCol + 1}`);
            const kingSideSquare2 = document.getElementById(`square-r${kingRow}-c${kingCol + 2}`);
            console.log('Checking king-side castling');

            if (!kingSideSquare1.querySelector('img') && !kingSideSquare2.querySelector('img')) {
                kingSideSquare2.classList.add('highlight-move'); // Highlight king-side castling
            }
        }

        // Queen-side castling
        if (!rook1Moved &&
            !isSquareUnderAttack(kingRow, kingCol - 1, isCurrentTurnWhite ? '-b' : '-w') &&
            !isSquareUnderAttack(kingRow, kingCol - 2, isCurrentTurnWhite ? '-b' : '-w') &&
            !isSquareUnderAttack(kingRow, kingCol - 3, isCurrentTurnWhite ? '-b' : '-w')) {

            const queenSideSquare1 = document.getElementById(`square-r${kingRow}-c${kingCol - 1}`);
            const queenSideSquare2 = document.getElementById(`square-r${kingRow}-c${kingCol - 2}`);
            const queenSideSquare3 = document.getElementById(`square-r${kingRow}-c${kingCol - 3}`);
            console.log('Checking queen-side castling');

            // Ensure all squares are unoccupied and not under attack
            if (!queenSideSquare1.querySelector('img') && 
                !queenSideSquare2.querySelector('img') && 
                !queenSideSquare3.querySelector('img')) {
                queenSideSquare2.classList.add('highlight-move'); // Highlight queen-side castling
            }
        }
    }
}
            




            
        });
    });
    
    // Add event listeners to all img elements and drop zones
    document.querySelectorAll('.wb img, .bb img').forEach((img) => {
        img.addEventListener('dragstart', dragStart);
    });
    document.querySelectorAll('.wb, .bb').forEach((square) => {
        square.addEventListener('dragover', dragOver);
        square.addEventListener('drop', drop);
    });
});

