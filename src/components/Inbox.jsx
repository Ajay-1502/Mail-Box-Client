import { useEffect, useState } from 'react';
import { ref, onValue, update, remove } from 'firebase/database';
import { db } from '../firebase'; // imported db instance

const Inbox = ({ userEmail }) => {
  const [mails, setMails] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null); // store clicked mail
  const [showModal, setShowModal] = useState(false); // modal state
  const [loading, setLoading] = useState(true);

  // Convert email to Firebase-safe key
  const cleanEmail = (userEmail || 'testuser1@gmail.com').replace(/[@.]/g, '_');

  useEffect(() => {
    //ref() tells firebase exactly where to look in the database
    const mailRef = ref(db, `inbox/${cleanEmail}`);

    // onValue is a real-time listener
    // snapshot is like a screenshot of data at that moment
    const unsubscribe = onValue(mailRef, (snapshot) => {
      //Extracts actual data stored at that location
      const data = snapshot.val();

      //If data is not found then it sets mails to empty array and loading to false
      if (!data) {
        setMails([]);
        setLoading(false);
        return;
      }

      //Convert objects to array of objects
      const loadedMails = Object.entries(data).map(([id, mail]) => ({
        id,
        ...mail,
      }));

      //Sorts mail in descending order based on date and time (To show latest first)
      loadedMails.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setMails(loadedMails);
      setLoading(false);
    });

    // detach listener when component unmounts
    return () => unsubscribe();
  }, [cleanEmail]);

  if (loading) return <p className="text-center mt-4">Loading inbox...</p>;

  // open modal with selected mail
  const openMail = (mail) => {
    setSelectedMail(mail);
    setShowModal(true);

    if (!mail.read) {
      //ref() tells firebase exactly where to look for the required email
      const mailRef = ref(db, `inbox/${cleanEmail}/${mail.id}`);

      //Updates only read field in the mailObject
      update(mailRef, { read: true });
    }
  };

  // close modal
  const closeModal = () => {
    setSelectedMail(null);
    setShowModal(false);
  };

  // Delete mail after user clicks on delete button
  const handleDeleteMail = async (id) => {
    try {
      const mailRef = ref(db, `inbox/${cleanEmail}/${id}`);

      //Removes mail that matches with id from firebase, since we are using real-time firebase , we get updated UI on screen without refreshing the screen.
      await remove(mailRef);
      alert('🗑️ Mail deleted successfully!');
    } catch (err) {
      alert('❌ Failed to delete mail. Try again.');
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">📥 Inbox</h3>

      {/* Counts mails that are not read*/}
      <span className="badge bg-danger mb-3">
        {mails.filter((m) => !m.read).length} Unread
      </span>

      {mails.length === 0 ? (
        <p>No mails found.</p>
      ) : (
        <ul className="list-group">
          {mails.map((mail) => (
            <li
              key={mail.id}
              className="list-group-item d-flex justify-content-between align-items-center m-2"
              style={{ cursor: 'pointer' }}
              onClick={() => openMail(mail)}
            >
              <div>
                {!mail.read && (
                  <span
                    className="badge bg-primary me-2"
                    style={{
                      borderRadius: '50%',
                      width: '6px',
                      height: '15px',
                    }}
                  >
                    &nbsp;
                  </span>
                )}
                <strong>{mail.subject || '(No Subject)'}</strong>
                <div className="text-muted small">From: {mail.from}</div>
              </div>
              <span className="text-muted small align-items-end">
                {new Date(mail.timestamp).toLocaleString()}
              </span>

              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDeleteMail(mail.id)}
              >
                🗑️
              </button>
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
