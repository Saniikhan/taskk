import React, { useState } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaCheckCircle } from 'react-icons/fa'; // Importing Font Awesome icon

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  skills: Yup.array().of(Yup.string().required('Skill is required')).min(1, 'At least one skill is required'),
});

const initialValues = {
  name: '',
  email: '',
  skills: [''],
  rememberMe: false,
};

const Forms = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Function to reorder skills array on drag end
  const onDragEnd = (result, skills, setFieldValue) => {
    if (!result.destination) return;
    const reorderedSkills = Array.from(skills);
    const [movedSkill] = reorderedSkills.splice(result.source.index, 1);
    reorderedSkills.splice(result.destination.index, 0, movedSkill);
    setFieldValue('skills', reorderedSkills);
  };

  return (
    <div className="center-container">
      <div className="form-wrapper">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            console.log('Submitted data:', values);
            setSubmitting(false);
            setSubmitSuccess(true); // Set success message
            setTimeout(() => {
              setSubmitSuccess(false); // Hide after 3 seconds
              resetForm();
            }, 3000);
          }}
        >
          {({ values, setFieldValue, isSubmitting, resetForm }) => (
            <Form className="row row-cols-lg-auto g-3 align-items-center">
              {/* Success Message */}
              {submitSuccess && (
                <div className="alert alert-success d-flex justify-content-center align-items-center">
                  <FaCheckCircle className="me-2" size={24} /> {/* Success Icon */}
                  <span>Form submitted successfully!</span>
                </div>
              )}

              {/* Name */}
              <h2 className='form'>Form</h2>
              <div className="col-12">
                <label htmlFor="name">Name</label>
                <Field
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  placeholder="Name"
                />
                <ErrorMessage name="name" component="div" className="text-danger" />
              </div>

              {/* Email */}
              <div className="col-12">
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Email"
                />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </div>

              {/* Skills (FieldArray for dynamic inputs) */}
              <div className="col-12">
                <label htmlFor="skills">Skills</label>
                <FieldArray name="skills">
                  {({ remove, push }) => (
                    <div>
                      <DragDropContext
                        onDragEnd={(result) => onDragEnd(result, values.skills, setFieldValue)}
                      >
                        <Droppable droppableId="skills">
                          {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                              {values.skills.map((skill, index) => (
                                <Draggable key={index} draggableId={String(index)} index={index}>
                                  {(provided) => (
                                    <div
                                      className="input-group mb-2"
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <Field
                                        name={`skills.${index}`}
                                        placeholder="Skill"
                                        className="form-control"
                                      />
                                      <button
                                        type="button"
                                        className='remove-button'
                                        onClick={() => remove(index)}
                                        disabled={values.skills.length === 1}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                      <ErrorMessage name="skills" component="div" className="text-danger" />
                      <button
                        type="button"
                        className="reset-button"
                        onClick={() => push('')}
                      >
                        Add Skill
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>

              {/* Remember Me */}
              <div className="col-12">
                <div className="form-check">
                  <Field
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>
              </div>

              {/* Submit and Reset */}
              <div className="col-12">
                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  Submit
                </button>
                <button
                  type="button"
                  className="reset-button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  Reset
                </button>
              </div>

              {/* Display Submitted JSON */}
              <pre className="mt-4">{JSON.stringify(values, null, 2)}</pre>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Forms;
