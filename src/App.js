import React, { useState, useEffect } from "react";
import './App.css';
import Modal from 'react-modal';
import ReactPlayer from 'react-player';  // Import React Player

Modal.setAppElement('#root'); // Set the root element for accessibility

function App() {
  const [media, setMedia] = useState([]);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null); // State to track selected media for modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log("useEffect called");
    fetch("/api/get-media?groupId=86727")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Media data received from backend:", data);
        setMedia(data);
      })
      .catch((error) => {
        console.error("Error fetching media:", error);
        setError(error.message);
      });
  }, []);

  const handleClick = (mediaItem) => {
    setSelectedMedia(mediaItem); // Set selected media for modal
    setIsModalOpen(true); // Open modal
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMedia(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Media Gallery</h1>
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <div className="media-grid">
            {media.length === 0 ? (
              <p>Loading...</p>
            ) : (
              media.map((item, index) => {
                const imageUrl = `/api/proxy-image?url=${encodeURIComponent(`https://saas.navori.com/NavoriService/MediaUpload.aspx?key=${item.ThumbnailPath}`)}`;

                return (
                  <button key={index} className="media-item" onClick={() => handleClick(item)}>
                    <img
                      src={imageUrl}
                      alt={`Media ${index + 1}`}
                      style={{ width: "126px", height: "70px", backgroundSize: "contain" }}
                    />
                    <h2>{item.Name}</h2> {/* Display media title */}
                  </button>
                );
              })
            )}
          </div>
        )}

        {/* Modal for enlarged image or video */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Media Modal"
          className="media-modal"
          overlayClassName="media-modal-overlay"
        >
          {selectedMedia && (
            <div className="media-content">
              <button onClick={closeModal}>Close</button>
              {selectedMedia.FileType === 'video' ? (
                <ReactPlayer
                  url={`/api/proxy-image?url=${encodeURIComponent(`https://saas.navori.com/NavoriService/MediaUpload.aspx?key=${selectedMedia.MediaPath}`)}`}
                  controls
                  playing
                  width="100%"
                  height="100%"
                  volume={0.8}
                  loop={false}  // Add options for replay, volume, etc.
                />
              ) : (
                <img
                  src={`/api/proxy-image?url=${encodeURIComponent(`https://saas.navori.com/NavoriService/MediaUpload.aspx?key=${selectedMedia.MediaPath}`)}`}
                  alt={selectedMedia.ThumbnailPath}
                  style={{ width: "100%" }}
                />
              )}
            </div>
          )}
        </Modal>
      </header>
    </div>
  );
}

export default App;
