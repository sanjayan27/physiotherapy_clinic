import React from 'react'

export const WhatsappMessageInbox = ({activeTab,whatsappMessages}) => {
  return (
    <div>
        {activeTab === "messages" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">WhatsApp Messages</h2>

              <div className="grid gap-4">
                {whatsappMessages.map((message) => (
                  <div
                    key={message.id}
                    className="bg-white rounded-lg shadow p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium">{message.patientName}</h3>
                          <span className="text-sm text-gray-500">
                            {message.phone}
                          </span>
                          <span className="text-sm text-gray-500">
                            {message.time}
                          </span>
                          {message.status === "unread" && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-gray-700">{message.message}</p>
                      </div>
                      <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
    </div>
  )
}
