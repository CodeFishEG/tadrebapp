// (C) Copyright 2015 Moodle Pty Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { AddonFilterMultilangHandler } from '@addons/filter/multilang/services/handlers/multilang';
import { AddonFilterMultilang2Handler } from '@addons/filter/multilang2/services/handlers/multilang2';
import { Component, Input, OnInit, Type } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AuthEmailSignupProfileField } from '@features/login/services/login-helper';
import { CoreUserProfileField } from '@features/user/services/user';
import { CoreUserProfileFieldDelegate } from '@features/user/services/user-profile-field-delegate';
import { CoreUtils } from '@services/utils/utils';

/**
 * Directive to render user profile field.
 */
@Component({
    selector: 'core-user-profile-field',
    templateUrl: 'core-user-profile-field.html',
})
export class CoreUserProfileFieldComponent implements OnInit {

    @Input() field?: AuthEmailSignupProfileField | CoreUserProfileField; // The profile field to be rendered.
    @Input() signup = false; // True if editing the field in signup. Defaults to false.
    @Input() edit = false; // True if editing the field. Defaults to false.
    @Input() form?: FormGroup; // Form where to add the form control. Required if edit=true or signup=true.
    @Input() registerAuth?: string; // Register auth method. E.g. 'email'.
    @Input() contextLevel?: string; // The context level.
    @Input() contextInstanceId?: number; // The instance ID related to the context.
    @Input() courseId?: number; // Course ID the field belongs to (if any). It can be used to improve performance with filters.

    componentClass?: Type<unknown>; // The class of the component to render.
    data: CoreUserProfileFieldComponentData = {}; // Data to pass to the component.

    /**
     * @inheritdoc
     */
    async ngOnInit(): Promise<void> {
        if (!this.field) {
            return;
        }

        this.componentClass = await CoreUserProfileFieldDelegate.getComponent(this.field, this.signup);

        if ('param1' in this.field && this.field.param1) {
            this.field.param1 = await AddonFilterMultilangHandler.filter(<string> this.field.param1);
            this.field.param1 = await AddonFilterMultilang2Handler.filter(<string> this.field.param1);
        }

        this.data.field = this.field;
        this.data.edit = CoreUtils.isTrueOrOne(this.edit);
        this.data.contextLevel = this.contextLevel;
        this.data.contextInstanceId = this.contextInstanceId;
        this.data.courseId = this.courseId;

        if (this.edit) {
            this.data.signup = CoreUtils.isTrueOrOne(this.signup);
            this.data.disabled = 'locked' in this.field && CoreUtils.isTrueOrOne(this.field.locked);
            this.data.form = this.form;
            this.data.registerAuth = this.registerAuth;
        }
    }

}

export type CoreUserProfileFieldComponentData = {
    field?: AuthEmailSignupProfileField | CoreUserProfileField;
    edit?: boolean;
    signup?: boolean;
    disabled?: boolean;
    form?: FormGroup;
    registerAuth?: string;
    contextLevel?: string;
    contextInstanceId?: number;
    courseId?: number;
};
