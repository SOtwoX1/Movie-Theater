import React from "react";
import Swal from 'sweetalert2'

const ContactForm = () => {
  const handdlesubmit=()=>{
    Swal.fire({
      title: "Loading",
      icon: "info",
      showConfirmButton: false,
      timer: 1000,
    }).then(() => {
      Swal.fire({
        title: "Success",
        text: "Your commment submitted",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      })
    });
  }
    return (
      <div className="flex items-center justify-center h-auto bg-gradient-to-r from-slate-50 to-gray-300">
        <div className="flex items-center justify-center h-auto my-8 rounded-lg bg-slate-400 border-2">
          <div
            className="rounded-lg border bg-card text-card-foreground shadow-sm border-none"
            data-v0-t="card"
          >
            <div className="p-6">
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-semibold">Contact Us</h2>
                  <p className=" text-zinc-900">
                    Fill out the form below and we'll get back to you as soon as
                    possible.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium leading-none"
                        htmlFor="first-name"
                      >
                        First name
                      </label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        id="first-name"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium leading-none"
                        htmlFor="last-name"
                      >
                        Last name
                      </label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        id="last-name"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium leading-none"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      id="email"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium leading-none"
                      htmlFor="pronoun"
                    >
                      Pronoun
                    </label>
                    <select
                      id="pronoun"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm dropdown"
                    >
                      <option>Select your pronoun</option>
                      <option value="he/him">He/Him</option>
                      <option value="she/her">She/Her</option>
                      <option value="they/them">They/Them</option>
                      <option value="prefer not to say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium leading-none"
                      htmlFor="message"
                    >
                      Message
                    </label>
                    <textarea
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                      id="message"
                      placeholder="Enter your message"
                    ></textarea>
                  </div>
                  <button 
                    onClick={handdlesubmit}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium hover:bg-black h-10 px-4 py-2 bg-gray-800 text-white"
                    type="submit"
                  >
                    Send message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default ContactForm;
