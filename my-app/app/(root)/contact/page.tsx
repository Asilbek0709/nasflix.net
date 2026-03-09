"use client"

import { TextField } from "@mui/material"
import { useState } from "react"
import { motion } from "framer-motion"

export default function Contact(): JSX.Element {


  const [name, setName] = useState<string>("")
  const [surname, setSurname] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [comm, setComm] = useState<string>("")

  const sendData = async (): Promise<void> => {
    await fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, surname, email, comm }),
    })

    setName("")
    setComm("")
    setSurname("")
    setEmail("")
  }

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <>
      <div className="flex flex-col p-40">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center text-6xl text-destructive font-bold font-sans"
        >
          <motion.div variants={item}>
            <h1 className="text-center text-6xl text-destructive font-bold font-sans">
              Biz bilan bog`laning
            </h1>
          </motion.div>
        </motion.div>

        <div className="flex gap-20 p-20 align-middle">

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col gap-5"
          >

            <div className="flex gap-5">

              <motion.div variants={item}>
                <TextField
                  label="Ism"
                  variant="outlined"
                  placeholder="Ism"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                  sx={{
                    width: 300,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      "& fieldset": {
                        borderColor: "gray",
                      },
                      "&:hover fieldset": {
                        borderColor: "blue",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "red",
                      },
                      color: "white"
                    },
                    "& .MuiInputLabel-root": {
                      color: "gray",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "red",
                    },
                  }}
                />
              </motion.div>

              <motion.div variants={item}>
                <TextField
                  label="Familiya"
                  variant="outlined"
                  placeholder="Familiya"
                  value={surname}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSurname(e.target.value)
                  }
                  sx={{
                    width: 300,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "gray",
                      },
                      "&:hover fieldset": {
                        borderColor: "blue",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "red",
                      },
                      borderRadius: "8px",
                      color: "white"
                    },
                    "& .MuiInputLabel-root": {
                      color: "gray",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "red",
                    },
                  }}
                />
              </motion.div>

            </div>

            <motion.div variants={item}>
              <TextField
                label="Email manzilingiz"
                variant="outlined"
                placeholder="Email manzilingiz"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                sx={{
                  width: 620,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "gray",
                    },
                    "&:hover fieldset": {
                      borderColor: "blue",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "red",
                    },
                    borderRadius: "8px",
                    color: "white"
                  },
                  "& .MuiInputLabel-root": {
                    color: "gray",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "red",
                  },
                }}
              />
            </motion.div>

            <motion.div variants={item}>
              <TextField
                label="Izoh qoldiring"
                multiline
                rows={7}
                variant="standard"
                value={comm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setComm(e.target.value)
                }
                sx={{
                  width: 620,
                  "& .MuiInputBase-input": {
                    color: "white",
                  },
                  "& .MuiInputLabel-root": {
                    color: "gray",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "red",
                  },
                }}
              />
            </motion.div>

            <motion.div variants={item}>
              <button
                onClick={sendData}
                className="flex w-30 rounded-xl bg-chart-1 p-2 justify-center text-background"
              >
                Jo`natish
              </button>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </>
  )
}