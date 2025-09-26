import { useEffect, useState } from 'react';

const Inbox = ({ userEmail }) => {
  const [mails, setMails] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null); // store clicked mail
  const [showModal, setShowModal] = useState(false); // modal state
  const [loading, setLoading] = useState(true);

  // Convert email to Firebase-safe key
  const cleanEmail = (userEmail || 'testuser1@gmail.com').replace(/[@.]/g, '_');

  useEffect(() => {
    const fetchMails = async () => {
      try {
        const res = await fetch(
          `https://mail-box-client-f22d7-default-rtdb.firebaseio.com/inbox/${cleanEmail}.json`
        );

        if (!res.ok) throw new Error('Failed to fetch mails.');

        const data = await res.json();
        if (!data) {
          setMails([]);
          setLoading(false);
          return;
        }

        // Convert object → array
        const loadedMails = Object.entries(data).map(([id, mail]) => ({
          id,
          ...mail,
        }));

        // Sort newest first
        loadedMails.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        setMails(loadedMails);
      } catch (err) {
        console.error('Error fetching inbox:', err);
        alert('Error fetching inbox:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMails();
  }, [cleanEmail]);

  if (loading) return <p className="text-center mt-4">Loading inbox...</p>;

  // open modal with selected mail
  const openMail = (mail) => {
    setSelectedMail(mail);
    setShowModal(true);
  };

  // close modal
  const closeModal = () => {
    setSelectedMail(null);
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">📥 Inbox</h3>

      {mails.length === 0 ? (
        <p>No mails found.</p>
      ) : (
        <ul className="list-group">
          {mails.map((mail) => (
            <li
              key={mail.id}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{ cursor: 'pointer' }}
              onClick={() => openMail(mail)}
            >
              <div>
                <strong>{mail.subject || '(No Subject)'}</strong>
                <div className="text-muted small">From: {mail.from}</div>
              </div>
              <span className="text-muted small">
                {new Date(mail.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      {showModal && selectedMail && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedMail.subject}</h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>From:</strong> {selectedMail.from}
                </p>
                <p>
                  <strong>To:</strong> {selectedMail.to}
                </p>
                <p>
                  <strong>Sent:</strong>{' '}
                  {new Date(selectedMail.timestamp).toLocaleString()}
                </p>
                <hr />
                {/* Render body as HTML */}
                <div
                  dangerouslySetInnerHTML={{ __html: selectedMail.body }}
                ></div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;
